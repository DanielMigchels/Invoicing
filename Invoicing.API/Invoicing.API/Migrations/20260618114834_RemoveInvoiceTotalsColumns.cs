using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Invoicing.API.Migrations
{
    /// <inheritdoc />
    public partial class RemoveInvoiceTotalsColumns : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "TotalExcludingVat",
                table: "Invoices");

            migrationBuilder.DropColumn(
                name: "TotalIncludingVat",
                table: "Invoices");

            migrationBuilder.DropColumn(
                name: "VatAmount",
                table: "Invoices");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<decimal>(
                name: "TotalExcludingVat",
                table: "Invoices",
                type: "numeric",
                nullable: false,
                defaultValue: 0m);

            migrationBuilder.AddColumn<decimal>(
                name: "TotalIncludingVat",
                table: "Invoices",
                type: "numeric",
                nullable: false,
                defaultValue: 0m);

            migrationBuilder.AddColumn<decimal>(
                name: "VatAmount",
                table: "Invoices",
                type: "numeric",
                nullable: false,
                defaultValue: 0m);
        }
    }
}
