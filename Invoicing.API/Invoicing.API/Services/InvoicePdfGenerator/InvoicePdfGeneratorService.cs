using Invoicing.API.Data.Models;
using PdfSharp.Drawing;
using PdfSharp.Fonts;
using PdfSharp.Pdf;

namespace Invoicing.API.Services.InvoicePdfGenerator;

public class InvoicePdfGeneratorService : IInvoicePdfGeneratorService
{
    private const double Margin = 42;
    private const double BottomMargin = 60;
    private const double LineHeight = 16;
    private const double TableHeaderHeight = 22;
    private const double TableRowHeight = 18;

    public Stream GeneratePdf(Invoice invoice)
    {
        var document = new PdfDocument();
        document.Info.Title = $"Factuur {invoice.InvoiceNumber}";
        document.Info.Subject = "Dutch invoice";

        if (GlobalFontSettings.FontResolver is null)
        {
            GlobalFontSettings.FontResolver = new CustomFontResolver();
        }

        var page = document.AddPage();
        var gfx = XGraphics.FromPdfPage(page);

        var headingFont = new XFont("Arial", 19, XFontStyleEx.Bold);
        var sectionTitleFont = new XFont("Arial", 10, XFontStyleEx.Bold);
        var bodyFont = new XFont("Arial", 9.5);
        var bodyBoldFont = new XFont("Arial", 9.5, XFontStyleEx.Bold);
        var smallFont = new XFont("Arial", 8);
        var smallItalic = new XFont("Arial", 8, XFontStyleEx.Italic);

        var pageWidth = page.Width.Point;
        var contentWidth = pageWidth - (Margin * 2);
        var y = Margin;

        DrawHeaderBand(gfx, page, invoice, headingFont, bodyFont, smallItalic);
        y += 78;

        y = DrawPartiesSection(gfx, invoice, sectionTitleFont, bodyFont, y, contentWidth);
        y += 18;

        y = DrawInvoiceMetaSection(gfx, invoice, sectionTitleFont, bodyFont, y, contentWidth);
        y += 18;

        y = DrawLinesTable(document, ref page, ref gfx, invoice, bodyFont, bodyBoldFont, sectionTitleFont, smallFont, y, contentWidth);
        y += 18;

        y = DrawTotalsSection(gfx, invoice, sectionTitleFont, bodyFont, bodyBoldFont, y, contentWidth);

        if (!string.IsNullOrWhiteSpace(invoice.VatExemptionReason))
        {
            y += 16;
            y = DrawInfoBox(
                gfx,
                "BTW-vrijstelling",
                invoice.VatExemptionReason,
                sectionTitleFont,
                bodyFont,
                y,
                contentWidth,
                XColor.FromArgb(248, 250, 252));
        }

        if (!string.IsNullOrWhiteSpace(invoice.Notes))
        {
            y += 12;
            y = DrawInfoBox(
                gfx,
                "Opmerkingen",
                invoice.Notes,
                sectionTitleFont,
                bodyFont,
                y,
                contentWidth,
                XColor.FromArgb(245, 248, 255));
        }

        y += 14;
        if (y > page.Height.Point - BottomMargin - 85)
        {
            page = document.AddPage();
            gfx = XGraphics.FromPdfPage(page);
            y = Margin;
        }

        y = DrawPaymentInstruction(gfx, invoice, sectionTitleFont, bodyFont, y, contentWidth);

        DrawFooter(gfx, page, invoice, smallFont);

        var stream = new MemoryStream();
        document.Save(stream);
        stream.Position = 0;
        return stream;
    }

    private static void DrawHeaderBand(XGraphics gfx, PdfPage page, Invoice invoice, XFont headingFont, XFont bodyFont, XFont smallItalic)
    {
        var headerColor = XColor.FromArgb(20, 56, 110);

        gfx.DrawString(
            "FACTUUR",
            headingFont,
            XBrushes.Black,
            new XRect(Margin, 50, page.Width.Point - (Margin * 2), 30),
            XStringFormats.TopLeft);
    }

    private static double DrawPartiesSection(
        XGraphics gfx,
        Invoice invoice,
        XFont sectionTitleFont,
        XFont bodyFont,
        double y,
        double contentWidth)
    {
        var columnWidth = (contentWidth - 24) / 2;
        var leftX = Margin;
        var rightX = Margin + columnWidth + 24;

        DrawSectionLabel(gfx, "Leverancier", sectionTitleFont, leftX, y);
        DrawSectionLabel(gfx, "Afnemer", sectionTitleFont, rightX, y);
        y += 18;

        y = DrawAddressBlock(gfx, invoice.Company?.Name ?? string.Empty, CompanyAddress(invoice.Company), bodyFont, leftX, y, columnWidth);
        var rightY = DrawAddressBlock(gfx, invoice.Customer?.Name ?? string.Empty, CustomerAddress(invoice.Customer), bodyFont, rightX, y - (LineHeight * 5), columnWidth);

        return Math.Max(y, rightY);
    }

    private static double DrawInvoiceMetaSection(
        XGraphics gfx,
        Invoice invoice,
        XFont sectionTitleFont,
        XFont bodyFont,
        double y,
        double contentWidth)
    {
        DrawSectionLabel(gfx, "Factuurgegevens", sectionTitleFont, Margin, y);
        y += 16;

        var halfWidth = contentWidth / 2;
        var rightColX = Margin + halfWidth;

        y = DrawLabelValue(gfx, "Factuurnummer", invoice.InvoiceNumber, bodyFont, Margin, y, halfWidth - 12);
        var rightY = DrawLabelValue(gfx, "Factuurdatum", invoice.InvoiceDate.ToString("dd-MM-yyyy"), bodyFont, rightColX, y - LineHeight, halfWidth - 12);

        y = DrawLabelValue(gfx, "Vervaldatum", invoice.DueDate.ToString("dd-MM-yyyy"), bodyFont, Margin, y, halfWidth - 12);
        rightY = DrawLabelValue(gfx, "Valuta", invoice.Currency, bodyFont, rightColX, rightY, halfWidth - 12);

        var paymentReference = string.IsNullOrWhiteSpace(invoice.PaymentReference) ? "-" : invoice.PaymentReference;
        y = DrawLabelValue(gfx, "Betalingskenmerk", paymentReference, bodyFont, Margin, y, halfWidth - 12);
        // rightY = DrawLabelValue(gfx, "Klantnummer", invoice.CustomerId.ToString()[..8], bodyFont, rightColX, rightY, halfWidth - 12);

        return Math.Max(y, rightY);
    }

    private static double DrawLinesTable(
        PdfDocument document,
        ref PdfPage page,
        ref XGraphics gfx,
        Invoice invoice,
        XFont bodyFont,
        XFont bodyBoldFont,
        XFont sectionTitleFont,
        XFont smallFont,
        double y,
        double contentWidth)
    {
        DrawSectionLabel(gfx, "Factuurregels", sectionTitleFont, Margin, y);
        y += 18;

        DrawTableHeader(gfx, y, contentWidth, bodyBoldFont);
        y += TableHeaderHeight;

        foreach (var line in invoice.InvoiceLines.OrderBy(l => l.Description))
        {
            EnsurePageSpace(document, ref page, ref gfx, ref y, TableRowHeight + 10, invoice, bodyFont, smallFont);

            var net = line.Quantity * line.UnitPrice - line.DiscountAmount;
            var discountText = line.DiscountAmount > 0 ? FormatCurrency(line.DiscountAmount, invoice.Currency) : "-";
            var qtyText = line.Unit is null ? $"{line.Quantity:0.##}" : $"{line.Quantity:0.##} {line.Unit}";

            var x = Margin;
            var widths = GetTableWidths(contentWidth);

            gfx.DrawRectangle(XPens.LightGray, x, y, contentWidth, TableRowHeight);

            DrawCell(gfx, line.Description, bodyFont, x + 4, y + 4, widths[0] - 8, XStringFormats.TopLeft);
            x += widths[0];
            DrawCell(gfx, qtyText, bodyFont, x + 4, y + 4, widths[1] - 8, XStringFormats.TopLeft);
            x += widths[1];
            DrawCell(gfx, FormatCurrency(line.UnitPrice, invoice.Currency), bodyFont, x + 4, y + 4, widths[2] - 8, XStringFormats.TopRight);
            x += widths[2];
            DrawCell(gfx, discountText, bodyFont, x + 4, y + 4, widths[3] - 8, XStringFormats.TopRight);
            x += widths[3];
            DrawCell(gfx, $"{line.VatPercentage:0.##}%", bodyFont, x + 4, y + 4, widths[4] - 8, XStringFormats.TopRight);
            x += widths[4];
            DrawCell(gfx, FormatCurrency(net, invoice.Currency), bodyFont, x + 4, y + 4, widths[5] - 8, XStringFormats.TopRight);
            x += widths[5];
            DrawCell(gfx, FormatCurrency(line.Total, invoice.Currency), bodyBoldFont, x + 4, y + 4, widths[6] - 8, XStringFormats.TopRight);

            y += TableRowHeight;
        }

        if (invoice.InvoiceLines.Count == 0)
        {
            gfx.DrawRectangle(XPens.LightGray, Margin, y, contentWidth, TableRowHeight);
            gfx.DrawString("Geen factuurregels.", smallFont, XBrushes.Gray, new XRect(Margin + 8, y + 4, contentWidth - 16, TableRowHeight - 8), XStringFormats.TopLeft);
            y += TableRowHeight;
        }

        return y;
    }

    private static void DrawTableHeader(XGraphics gfx, double y, double contentWidth, XFont font)
    {
        var widths = GetTableWidths(contentWidth);
        var labels = new[] { "Omschrijving", "Aantal", "Prijs", "Korting", "BTW", "Netto", "Totaal" };
        var x = Margin;

        gfx.DrawRectangle(new XSolidBrush(XColor.FromArgb(238, 244, 255)), x, y, contentWidth, TableHeaderHeight);
        gfx.DrawRectangle(XPens.LightGray, x, y, contentWidth, TableHeaderHeight);

        for (var i = 0; i < labels.Length; i++)
        {
            var format = i < 2 ? XStringFormats.TopLeft : XStringFormats.TopRight;
            DrawCell(gfx, labels[i], font, x + 4, y + 5, widths[i] - 8, format);
            x += widths[i];
        }
    }

    private static double[] GetTableWidths(double contentWidth)
    {
        return new[]
        {
            contentWidth * 0.30,
            contentWidth * 0.11,
            contentWidth * 0.12,
            contentWidth * 0.12,
            contentWidth * 0.09,
            contentWidth * 0.13,
            contentWidth * 0.13,
        };
    }

    private static double DrawTotalsSection(
        XGraphics gfx,
        Invoice invoice,
        XFont sectionTitleFont,
        XFont bodyFont,
        XFont bodyBoldFont,
        double y,
        double contentWidth)
    {
        DrawSectionLabel(gfx, "Bedragen", sectionTitleFont, Margin, y);
        y += 18;

        var boxX = Margin + (contentWidth * 0.48);
        var boxWidth = contentWidth * 0.52;
        var lineY = y;
        var subtotal = invoice.InvoiceLines.Sum(l => l.Quantity * l.UnitPrice - l.DiscountAmount);
        var vatAmount = invoice.InvoiceLines.Sum(l => (l.Quantity * l.UnitPrice - l.DiscountAmount) * l.VatPercentage / 100m);
        var total = invoice.InvoiceLines.Sum(l => l.Total);

        gfx.DrawRectangle(new XSolidBrush(XColor.FromArgb(250, 251, 254)), boxX, lineY - 8, boxWidth, 66);

        lineY = DrawMoneyRow(gfx, "Subtotaal (excl. BTW)", subtotal, invoice.Currency, bodyFont, boxX + 10, lineY, boxWidth - 20);
        lineY = DrawMoneyRow(gfx, "BTW", vatAmount, invoice.Currency, bodyFont, boxX + 10, lineY, boxWidth - 20);

        gfx.DrawLine(XPens.Gray, boxX + 10, lineY + 2, boxX + boxWidth - 10, lineY + 2);
        lineY += 8;

        lineY = DrawMoneyRow(gfx, "Totaal te betalen", total, invoice.Currency, bodyBoldFont, boxX + 10, lineY, boxWidth - 20);

        return lineY + 8;
    }

    private static double DrawPaymentInstruction(
        XGraphics gfx,
        Invoice invoice,
        XFont sectionTitleFont,
        XFont bodyFont,
        double y,
        double contentWidth)
    {
        DrawSectionLabel(gfx, "Betaalinstructie", sectionTitleFont, Margin, y);
        y += 16;

        var total = invoice.InvoiceLines.Sum(l => l.Total);
        var text = $"Gelieve het totaalbedrag van {FormatCurrency(total, invoice.Currency)} uiterlijk op {invoice.DueDate:dd-MM-yyyy} te voldoen.";
        if (!string.IsNullOrWhiteSpace(invoice.Company?.BankAccountNumber))
        {
            text += $" Betalen op IBAN {invoice.Company.BankAccountNumber}.";
        }
        if (!string.IsNullOrWhiteSpace(invoice.PaymentReference))
        {
            text += $" Vermeld daarbij betalingskenmerk: {invoice.PaymentReference}.";
        }

        y = DrawWrappedText(gfx, text, bodyFont, Margin, y, contentWidth, LineHeight);
        return y;
    }

    private static void DrawFooter(XGraphics gfx, PdfPage page, Invoice invoice, XFont smallFont)
    {
        var footerText = $"Factuur {invoice.InvoiceNumber} - Gemaakt op {DateTime.Now:dd-MM-yyyy HH:mm}";
        gfx.DrawLine(XPens.LightGray, Margin, page.Height.Point - BottomMargin + 6, page.Width.Point - Margin, page.Height.Point - BottomMargin + 6);
        gfx.DrawString(
            footerText,
            smallFont,
            XBrushes.Gray,
            new XRect(Margin, page.Height.Point - BottomMargin + 12, page.Width.Point - (Margin * 2), 18),
            XStringFormats.TopLeft);
    }

    private static void DrawSectionLabel(XGraphics gfx, string label, XFont font, double x, double y)
    {
        gfx.DrawString(label, font, XBrushes.Black, new XRect(x, y, 350, 16), XStringFormats.TopLeft);
    }

    private static double DrawLabelValue(XGraphics gfx, string label, string value, XFont font, double x, double y, double width)
    {
        gfx.DrawString(label, font, XBrushes.Gray, new XRect(x, y, width, LineHeight), XStringFormats.TopLeft);
        gfx.DrawString(value, font, XBrushes.Black, new XRect(x + 120, y, width - 120, LineHeight), XStringFormats.TopLeft);
        return y + LineHeight;
    }

    private static double DrawAddressBlock(XGraphics gfx, string title, IEnumerable<string> lines, XFont font, double x, double y, double width)
    {
        gfx.DrawString(title, font, XBrushes.Black, new XRect(x, y, width, LineHeight), XStringFormats.TopLeft);
        y += LineHeight;
        foreach (var line in lines.Where(l => !string.IsNullOrWhiteSpace(l)))
        {
            gfx.DrawString(line, font, XBrushes.Black, new XRect(x, y, width, LineHeight), XStringFormats.TopLeft);
            y += LineHeight;
        }
        return y;
    }

    private static IEnumerable<string> CompanyAddress(Company? company)
    {
        if (company is null) return [];

        return new[]
        {
            $"{company.Street} {company.HouseNumber}",
            $"{company.PostalCode} {company.City}",
            company.Country,
            string.IsNullOrWhiteSpace(company.Email) ? string.Empty : company.Email,
            string.IsNullOrWhiteSpace(company.VatNumber) ? string.Empty : $"BTW: {company.VatNumber}",
            string.IsNullOrWhiteSpace(company.ChamberOfCommerceNumber) ? string.Empty : $"KvK: {company.ChamberOfCommerceNumber}",
        };
    }

    private static IEnumerable<string> CustomerAddress(Customer? customer)
    {
        if (customer is null) return [];

        return new[]
        {
            $"{customer.Street} {customer.HouseNumber}",
            $"{customer.PostalCode} {customer.City}",
            customer.Country,
            string.IsNullOrWhiteSpace(customer.ContactPerson) ? string.Empty : $"t.a.v. {customer.ContactPerson}",
            string.IsNullOrWhiteSpace(customer.Email) ? string.Empty : customer.Email,
            string.IsNullOrWhiteSpace(customer.VatNumber) ? string.Empty : $"BTW: {customer.VatNumber}",
        };
    }

    private static void EnsurePageSpace(
        PdfDocument document,
        ref PdfPage page,
        ref XGraphics gfx,
        ref double y,
        double requiredSpace,
        Invoice invoice,
        XFont bodyFont,
        XFont smallFont)
    {
        if (y + requiredSpace <= page.Height.Point - BottomMargin)
        {
            return;
        }

        DrawFooter(gfx, page, invoice, smallFont);
        page = document.AddPage();
        gfx = XGraphics.FromPdfPage(page);
        y = Margin;

        gfx.DrawString(
            $"Factuur {invoice.InvoiceNumber} (vervolg)",
            bodyFont,
            XBrushes.Black,
            new XRect(Margin, y, page.Width.Point - (Margin * 2), 16),
            XStringFormats.TopLeft);
        y += 20;

        DrawTableHeader(gfx, y, page.Width.Point - (Margin * 2), new XFont("Arial", 9.5, XFontStyleEx.Bold));
        y += TableHeaderHeight;
    }

    private static void DrawCell(XGraphics gfx, string text, XFont font, double x, double y, double width, XStringFormat format)
    {
        gfx.DrawString(text, font, XBrushes.Black, new XRect(x, y, width, 12), format);
    }

    private static double DrawMoneyRow(XGraphics gfx, string label, decimal amount, string currency, XFont font, double x, double y, double width)
    {
        gfx.DrawString(label, font, XBrushes.Black, new XRect(x, y, width, LineHeight), XStringFormats.TopLeft);
        gfx.DrawString(FormatCurrency(amount, currency), font, XBrushes.Black, new XRect(x, y, width, LineHeight), XStringFormats.TopRight);
        return y + LineHeight;
    }

    private static string FormatCurrency(decimal amount, string currency)
    {
        var symbol = string.Equals(currency, "EUR", StringComparison.OrdinalIgnoreCase) ? "EUR" : currency;
        return $"{amount:0.00} {symbol}";
    }

    private static double DrawInfoBox(
        XGraphics gfx,
        string title,
        string text,
        XFont titleFont,
        XFont bodyFont,
        double y,
        double width,
        XColor background)
    {
        var contentY = y + 8;
        var x = Margin;
        var boxWidth = width;

        var simulatedY = contentY + 16;
        simulatedY = DrawWrappedText(gfx, text, bodyFont, x + 10, simulatedY, boxWidth - 20, LineHeight, draw: false);
        var boxHeight = (simulatedY - y) + 6;

        gfx.DrawRectangle(new XSolidBrush(background), x, y, boxWidth, boxHeight);
        gfx.DrawRectangle(XPens.LightGray, x, y, boxWidth, boxHeight);

        gfx.DrawString(title, titleFont, XBrushes.Black, new XRect(x + 10, contentY, boxWidth - 20, 16), XStringFormats.TopLeft);
        var finalY = DrawWrappedText(gfx, text, bodyFont, x + 10, contentY + 16, boxWidth - 20, LineHeight);

        return finalY + 8;
    }

    private static double DrawWrappedText(
        XGraphics gfx,
        string text,
        XFont font,
        double x,
        double y,
        double maxWidth,
        double lineHeight,
        bool draw = true)
    {
        var words = text.Split(' ', StringSplitOptions.RemoveEmptyEntries);
        var line = string.Empty;

        foreach (var word in words)
        {
            var test = string.IsNullOrEmpty(line) ? word : $"{line} {word}";
            if (gfx.MeasureString(test, font).Width <= maxWidth)
            {
                line = test;
                continue;
            }

            if (draw)
            {
                gfx.DrawString(line, font, XBrushes.Black, new XRect(x, y, maxWidth, lineHeight), XStringFormats.TopLeft);
            }
            y += lineHeight;
            line = word;
        }

        if (!string.IsNullOrWhiteSpace(line))
        {
            if (draw)
            {
                gfx.DrawString(line, font, XBrushes.Black, new XRect(x, y, maxWidth, lineHeight), XStringFormats.TopLeft);
            }
            y += lineHeight;
        }

        return y;
    }
}
