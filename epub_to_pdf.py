#!/usr/bin/env python3
"""
EPUB to PDF Converter

This script converts EPUB files to PDF format, extracting text and basic formatting.

Requirements:
    pip install ebooklib lxml weasyprint

Usage:
    python epub_to_pdf.py input.epub output.pdf
    python epub_to_pdf.py input.epub  # Output will be input.pdf
    python epub_to_pdf.py --help      # Show help message

Author: Golden Wings Documentary Project
"""

import argparse
import os
import sys
from pathlib import Path

try:
    from ebooklib import epub
    import ebooklib
    from lxml import etree, html
    from weasyprint import HTML, CSS
except ImportError as e:
    print(f"❌ Error: Missing required library - {e}")
    print("\n📦 Please install required dependencies:")
    print("   pip install ebooklib lxml weasyprint")
    print("\nAlternatively, on Ubuntu/Debian:")
    print("   sudo apt-get install python3-lxml python3-weasyprint")
    print("   pip install ebooklib")
    sys.exit(1)


def extract_epub_content(epub_path):
    """
    Extract text content and metadata from EPUB file.
    
    Args:
        epub_path: Path to the EPUB file
        
    Returns:
        tuple: (title, author, html_content)
    """
    try:
        book = epub.read_epub(epub_path)
    except Exception as e:
        raise ValueError(f"Failed to read EPUB file: {e}")
    
    # Get metadata
    title = book.get_metadata('DC', 'title')
    title = title[0][0] if title else "Untitled"
    
    author = book.get_metadata('DC', 'creator')
    author = author[0][0] if author else "Unknown Author"
    
    # Extract all text content from chapters
    chapters = []
    for item in book.get_items():
        if item.get_type() == ebooklib.ITEM_DOCUMENT:
            content = item.get_content()
            try:
                # Parse HTML content
                tree = html.fromstring(content)
                # Remove script and style elements
                for element in tree.xpath('.//script | .//style'):
                    element.getparent().remove(element)
                
                # Get text and preserve some structure
                chapter_html = html.tostring(tree, encoding='unicode', method='html')
                chapters.append(chapter_html)
            except Exception as e:
                print(f"⚠️  Warning: Could not parse chapter: {e}")
                continue
    
    if not chapters:
        raise ValueError("No content found in EPUB file")
    
    return title, author, chapters


def create_pdf_html(title, author, chapters):
    """
    Create formatted HTML content for PDF generation.
    
    Args:
        title: Book title
        author: Book author
        chapters: List of chapter HTML content
        
    Returns:
        str: Complete HTML document
    """
    html_template = f"""
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="UTF-8">
        <title>{title}</title>
        <style>
            @page {{
                size: A4;
                margin: 2.5cm;
                @bottom-center {{
                    content: counter(page);
                }}
            }}
            body {{
                font-family: 'Georgia', 'Times New Roman', serif;
                font-size: 12pt;
                line-height: 1.6;
                color: #333;
            }}
            h1, h2, h3, h4, h5, h6 {{
                color: #222;
                margin-top: 1em;
                margin-bottom: 0.5em;
                page-break-after: avoid;
            }}
            h1 {{
                font-size: 24pt;
                text-align: center;
                margin-bottom: 0.2em;
            }}
            .author {{
                text-align: center;
                font-size: 14pt;
                font-style: italic;
                margin-bottom: 2em;
                color: #666;
            }}
            p {{
                margin: 0.5em 0;
                text-align: justify;
            }}
            .chapter {{
                page-break-before: always;
            }}
            .chapter:first-child {{
                page-break-before: avoid;
            }}
            img {{
                max-width: 100%;
                height: auto;
            }}
            blockquote {{
                margin: 1em 2em;
                font-style: italic;
                border-left: 3px solid #ccc;
                padding-left: 1em;
            }}
            code {{
                font-family: 'Courier New', monospace;
                background-color: #f4f4f4;
                padding: 2px 4px;
            }}
            pre {{
                background-color: #f4f4f4;
                padding: 1em;
                overflow-x: auto;
            }}
        </style>
    </head>
    <body>
        <h1>{title}</h1>
        <p class="author">by {author}</p>
        <hr>
        {''.join(f'<div class="chapter">{chapter}</div>' for chapter in chapters)}
    </body>
    </html>
    """
    return html_template


def convert_epub_to_pdf(epub_path, pdf_path):
    """
    Convert EPUB file to PDF.
    
    Args:
        epub_path: Path to input EPUB file
        pdf_path: Path to output PDF file
    """
    print(f"📖 Reading EPUB file: {epub_path}")
    
    # Extract content from EPUB
    title, author, chapters = extract_epub_content(epub_path)
    
    print(f"📝 Title: {title}")
    print(f"✍️  Author: {author}")
    print(f"📄 Chapters found: {len(chapters)}")
    
    # Create HTML for PDF
    print("🔧 Generating PDF content...")
    html_content = create_pdf_html(title, author, chapters)
    
    # Generate PDF
    print(f"📄 Creating PDF: {pdf_path}")
    try:
        HTML(string=html_content).write_pdf(pdf_path)
    except Exception as e:
        raise RuntimeError(f"Failed to generate PDF: {e}")
    
    print(f"✅ Successfully created PDF: {pdf_path}")
    
    # Show file size
    file_size = os.path.getsize(pdf_path)
    size_mb = file_size / (1024 * 1024)
    print(f"📊 PDF size: {size_mb:.2f} MB")


def main():
    """Main entry point for the script."""
    parser = argparse.ArgumentParser(
        description="Convert EPUB files to PDF format",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
Examples:
  %(prog)s book.epub book.pdf       Convert book.epub to book.pdf
  %(prog)s book.epub                Convert book.epub to book.pdf (auto-name)
  %(prog)s input.epub output.pdf    Convert with specific names

Requirements:
  pip install ebooklib lxml weasyprint
        """
    )
    
    parser.add_argument(
        'epub_file',
        help='Path to the input EPUB file'
    )
    
    parser.add_argument(
        'pdf_file',
        nargs='?',
        default=None,
        help='Path to the output PDF file (optional, defaults to <epub_name>.pdf)'
    )
    
    parser.add_argument(
        '-v', '--version',
        action='version',
        version='%(prog)s 1.0'
    )
    
    args = parser.parse_args()
    
    # Validate input file
    epub_path = Path(args.epub_file)
    if not epub_path.exists():
        print(f"❌ Error: File not found: {epub_path}")
        sys.exit(1)
    
    if not epub_path.suffix.lower() == '.epub':
        print(f"⚠️  Warning: File does not have .epub extension: {epub_path}")
        response = input("Continue anyway? (y/n): ")
        if response.lower() != 'y':
            sys.exit(0)
    
    # Determine output file
    if args.pdf_file:
        pdf_path = Path(args.pdf_file)
    else:
        pdf_path = epub_path.with_suffix('.pdf')
    
    # Check if output file exists
    if pdf_path.exists():
        print(f"⚠️  Warning: Output file already exists: {pdf_path}")
        response = input("Overwrite? (y/n): ")
        if response.lower() != 'y':
            print("❌ Conversion cancelled")
            sys.exit(0)
    
    try:
        # Perform conversion
        convert_epub_to_pdf(str(epub_path), str(pdf_path))
        print("\n🎉 Conversion completed successfully!")
        
    except KeyboardInterrupt:
        print("\n\n⚠️  Conversion interrupted by user")
        sys.exit(1)
        
    except Exception as e:
        print(f"\n❌ Error during conversion: {e}")
        sys.exit(1)


if __name__ == '__main__':
    main()
