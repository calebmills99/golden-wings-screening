# EPUB to PDF Converter

A Python script to convert EPUB files to PDF format with proper formatting and styling.

## Features

- ✅ Converts EPUB files to PDF format
- ✅ Preserves book metadata (title, author)
- ✅ Maintains text formatting and structure
- ✅ Professional PDF styling with proper fonts and layout
- ✅ Command-line interface with auto-naming support
- ✅ Comprehensive error handling

## Requirements

- Python 3.6 or higher
- Dependencies:
  - `ebooklib` - For reading EPUB files
  - `lxml` - For HTML/XML parsing
  - `weasyprint` - For PDF generation

## Installation

### Option 1: Using pip (Recommended)

```bash
pip install ebooklib lxml weasyprint
```

### Option 2: Using requirements.txt

```bash
pip install -r requirements.txt
```

### Option 3: Ubuntu/Debian

```bash
sudo apt-get install python3-lxml python3-weasyprint
pip install ebooklib
```

## Usage

### Basic Usage

Convert an EPUB file to PDF:

```bash
python epub_to_pdf.py input.epub output.pdf
```

### Auto-naming

If you don't specify an output filename, the script will automatically create one:

```bash
python epub_to_pdf.py input.epub
# Creates: input.pdf
```

### Using with Virtual Environment

```bash
# Activate virtual environment
source venv/bin/activate

# Run the converter
python epub_to_pdf.py book.epub
```

### Make Script Executable (Linux/Mac)

```bash
chmod +x epub_to_pdf.py
./epub_to_pdf.py book.epub book.pdf
```

## Examples

```bash
# Convert a book
python epub_to_pdf.py "Golden Wings.epub" "Golden Wings.pdf"

# Convert with auto-naming
python epub_to_pdf.py novel.epub

# Get help
python epub_to_pdf.py --help

# Check version
python epub_to_pdf.py --version
```

## Output

The script will:
1. Read and validate the EPUB file
2. Extract metadata (title, author)
3. Extract all chapters and content
4. Generate a professionally formatted PDF
5. Display conversion statistics

Example output:
```
📖 Reading EPUB file: book.epub
📝 Title: My Book
✍️  Author: John Doe
📄 Chapters found: 15
🔧 Generating PDF content...
📄 Creating PDF: book.pdf
✅ Successfully created PDF: book.pdf
📊 PDF size: 2.45 MB

🎉 Conversion completed successfully!
```

## PDF Styling

The generated PDF includes:
- Professional serif fonts (Georgia, Times New Roman)
- Proper page margins (2.5cm)
- Page numbers at the bottom center
- Title page with author information
- Chapter breaks on new pages
- Justified text alignment
- Styled headings and paragraphs
- Support for images, blockquotes, and code blocks

## Error Handling

The script handles various error conditions:
- Missing input file
- Invalid EPUB format
- Empty EPUB files
- File permission issues
- Overwrite protection (prompts before overwriting)

## Troubleshooting

### "Missing required library" error

Install the dependencies:
```bash
pip install ebooklib lxml weasyprint
```

### WeasyPrint installation issues on Linux

WeasyPrint requires some system libraries. On Ubuntu/Debian:
```bash
sudo apt-get install python3-cffi python3-brotli libpango-1.0-0 libpangoft2-1.0-0
```

### Permission denied error

Make the script executable:
```bash
chmod +x epub_to_pdf.py
```

## Technical Details

- **Input Format**: EPUB (Electronic Publication) - `.epub` files
- **Output Format**: PDF (Portable Document Format) - `.pdf` files
- **Page Size**: A4 (210mm × 297mm)
- **Font Size**: 12pt for body text
- **Line Height**: 1.6 for better readability

## License

Part of the Golden Wings Documentary Project.

## Contributing

Issues and improvements are welcome. This script is part of the Golden Wings documentary screening project.

## Related Scripts

- `upload_to_youtube.py` - Upload videos to YouTube
- `captcha.py` - reCAPTCHA integration helper

---

*Generated with Claude Code*
