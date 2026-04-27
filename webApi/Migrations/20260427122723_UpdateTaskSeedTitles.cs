using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace webApi.Migrations
{
    /// <inheritdoc />
    public partial class UpdateTaskSeedTitles : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.UpdateData(
                table: "TaskItems",
                keyColumn: "Id",
                keyValue: 1,
                column: "Title",
                value: "Learn fronted");

            migrationBuilder.UpdateData(
                table: "TaskItems",
                keyColumn: "Id",
                keyValue: 2,
                column: "Title",
                value: "learn backend");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.UpdateData(
                table: "TaskItems",
                keyColumn: "Id",
                keyValue: 1,
                column: "Title",
                value: "Buy groceries");

            migrationBuilder.UpdateData(
                table: "TaskItems",
                keyColumn: "Id",
                keyValue: 2,
                column: "Title",
                value: "Walk the dog");
        }
    }
}
