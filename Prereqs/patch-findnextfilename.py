#!/usr/bin/env python3
"""Add a minimal FindNextFileNameW export to Wine's x86_64 kernel32.dll /
kernelbase.dll so Diablo IV 3.1.0 (which statically imports it) can load.

Mirrors the upstream Wine/CrossOver fix: the game only needs the export to
exist; the stub returns FALSE (end-of-enumeration). Stub = `xor eax,eax; ret`
(31 C0 C3) in a new executable section, then an export entry pointing at it.
"""
import sys, lief

STUB = bytes([0x31, 0xC0, 0xC3])  # xor eax, eax ; ret   (returns FALSE)
FUNC = "FindNextFileNameW"

def patch(path, out):
    b = lief.parse(path)
    if any(e.name == FUNC for e in b.get_export().entries):
        print(f"  {path}: already exports {FUNC}, skipping")
        return
    sec = lief.PE.Section(".fnfn")
    sec.content = list(STUB)
    sec.characteristics = (
        lief.PE.Section.CHARACTERISTICS.CNT_CODE.value
        | lief.PE.Section.CHARACTERISTICS.MEM_READ.value
        | lief.PE.Section.CHARACTERISTICS.MEM_EXECUTE.value
    )
    added = b.add_section(sec)
    rva = added.virtual_address
    b.get_export().add_entry(lief.PE.ExportEntry(FUNC, rva))
    cfg = lief.PE.Builder.config_t()
    cfg.exports = True          # rebuild the export table with our new entry
    cfg.dos_stub = True         # keep the DOS stub (Wine builtin marker lives here)
    builder = lief.PE.Builder(b, cfg)
    builder.build()
    builder.write(out)
    # verify round-trip
    v = lief.parse(out)
    ent = {e.name: e for e in v.get_export().entries}.get(FUNC)
    ok = ent is not None
    print(f"  {path}\n    -> {out}  export {FUNC}: {'OK ord='+str(ent.ordinal) if ok else 'FAILED'}")
    if not ok:
        sys.exit(1)

if __name__ == "__main__":
    src_dir, out_dir = sys.argv[1], sys.argv[2]
    import os
    os.makedirs(out_dir, exist_ok=True)
    for dll in ["kernel32.dll", "kernelbase.dll"]:
        patch(f"{src_dir}/{dll}", f"{out_dir}/{dll}")
