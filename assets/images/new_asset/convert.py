#!/usr/bin/env python3
"""
heic_to_avif_samefolder.py

Usage:
  python heic_to_avif_samefolder.py [--dir /path/to/folder] [--quality 70] [--overwrite]

Behavior:
  - Scans given folder (or current working dir) non-recursively for .heic/.heif files.
  - Converts each file to <same-name>.avif in same folder.
  - Tries Pillow-based read/write (requires pillow-heif + pillow-avif-plugin or
    Pillow compiled with AVIF). If Pillow cannot write AVIF, falls back to using avifenc CLI.

Requirements (recommended):
  - System libs: libheif, libavif (install via apt/brew), OR Windows: use WSL/MSYS2 for full support.
  - Python packages: pip install pillow pillow-heif pillow-avif-plugin
  - Optional CLI: avifenc (part of libavif) for fallback path.

Author: blunt & practical
"""
import argparse
import os
import sys
import tempfile
import shutil
import subprocess
from pathlib import Path

# Try imports
PIL_AVAILABLE = False
PIL_HEIF = False
PIL_AVIF_SAVE_TEST = False

try:
    from PIL import Image
    PIL_AVAILABLE = True
except Exception:
    PIL_AVAILABLE = False

# Try to enable pillow-heif opener if available
try:
    import pillow_heif
    try:
        pillow_heif.register_heif_opener()
    except Exception:
        pass
    PIL_HEIF = True
except Exception:
    PIL_HEIF = False

def avifenc_available():
    try:
        subprocess.run(["avifenc", "--version"], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL, check=True)
        return True
    except Exception:
        return False

def pillow_can_save_avif():
    # quick runtime test: create tiny image and try to save to memory as AVIF
    if not PIL_AVAILABLE:
        return False
    try:
        from io import BytesIO
        im = Image.new("RGB", (2,2), (255,0,0))
        buf = BytesIO()
        im.save(buf, format="AVIF", quality=50)
        return True
    except Exception:
        return False

def convert_with_pillow(src_path: Path, dst_path: Path, quality: int):
    try:
        with Image.open(src_path) as im:
            if im.mode not in ("RGB","RGBA"):
                im = im.convert("RGBA" if "A" in im.getbands() else "RGB")
            save_kwargs = {"quality": int(quality)}
            im.save(dst_path, format="AVIF", **save_kwargs)
        return True, "pillow_avif"
    except Exception as e:
        return False, f"pillow_failed:{e}"

def convert_via_avifenc(src_path: Path, dst_path: Path, quality: int):
    # Save PNG then call avifenc -q
    try:
        tmp = Path(tempfile.mkdtemp(prefix="heic2avif_"))
        tmp_png = tmp / (src_path.stem + ".fallback.png")
        # make sure Pillow can read the HEIC (pillow-heif helps)
        if not PIL_AVAILABLE:
            return False, "no_pillow_for_png_fallback"
        with Image.open(src_path) as im:
            if im.mode not in ("RGB","RGBA"):
                im = im.convert("RGBA" if "A" in im.getbands() else "RGB")
            im.save(tmp_png, format="PNG")
        # avifenc: use -q for quality (0-100)
        cmd = ["avifenc", "-q", str(max(0, min(100, int(quality)))), str(tmp_png), str(dst_path)]
        subprocess.run(cmd, check=True, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
        shutil.rmtree(tmp, ignore_errors=True)
        return True, "avifenc_used"
    except subprocess.CalledProcessError as cpe:
        return False, f"avifenc_failed:{cpe}"
    except Exception as e:
        return False, f"fallback_failed:{e}"

def find_heic_files(folder: Path):
    exts = {".heic", ".HEIC", ".heif", ".HEIF"}
    return [p for p in folder.iterdir() if p.suffix in exts and p.is_file()]

def main():
    parser = argparse.ArgumentParser(description="Convert HEIC/HEIF files in a folder to AVIF (same basename).")
    parser.add_argument("--dir", "-d", default=".", help="Folder to scan (default: current dir).")
    parser.add_argument("--quality", "-q", type=int, default=70, help="Quality 0-100 (default 70).")
    parser.add_argument("--overwrite", action="store_true", help="Overwrite existing .avif files.")
    args = parser.parse_args()

    folder = Path(args.dir).resolve()
    if not folder.exists() or not folder.is_dir():
        print("Folder not found or not a directory:", folder, file=sys.stderr)
        sys.exit(2)

    heic_files = find_heic_files(folder)
    if not heic_files:
        print("No HEIC/HEIF files found in:", folder)
        return

    pillow_avif_ok = pillow_can_save_avif()
    avifenc_ok = avifenc_available()
    print(f"Files found: {len(heic_files)}  | Pillow available: {PIL_AVAILABLE}  | pillow-heif: {PIL_HEIF}  | Pillow AVIF write: {pillow_avif_ok}  | avifenc: {avifenc_ok}")

    successes = []
    failures = []

    for src in heic_files:
        dst = src.with_suffix(".avif")
        if dst.exists() and not args.overwrite:
            print(f"SKIP (exists): {dst.name}")
            continue
        # Try Pillow write-to-AVIF if possible
        if pillow_avif_ok:
            ok, msg = convert_with_pillow(src, dst, args.quality)
            if ok:
                print(f"OK (pillow): {src.name} -> {dst.name}")
                successes.append((src, dst, msg))
                continue
            else:
                print(f"Pillow route failed for {src.name}: {msg}")
        # Fall back to avifenc path if available
        if avifenc_ok:
            ok2, msg2 = convert_via_avifenc(src, dst, args.quality)
            if ok2:
                print(f"OK (avifenc): {src.name} -> {dst.name}")
                successes.append((src, dst, msg2))
                continue
            else:
                print(f"avifenc fallback failed for {src.name}: {msg2}")
                failures.append((src, msg2))
        else:
            failures.append((src, "no_avif_write_path"))

    # Summary
    print("\nSummary:")
    print("Converted:", len(successes))
    if successes:
        for s in successes:
            print(" -", s[0].name, "->", s[1].name, "via", s[2])
    print("Failed:", len(failures))
    if failures:
        for f in failures:
            print(" -", f[0].name if hasattr(f[0],"name") else f[0], ":", f[1])

if __name__ == "__main__":
    main()
