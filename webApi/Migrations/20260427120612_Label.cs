using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace webApi.Migrations
{
    /// <inheritdoc />
    public partial class Label : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.InsertData(
                table: "Labels",
                columns: new[] { "Id", "Color", "Description", "Name" },
                values: new object[,]
                {
                    { 1, "#3B82F6", "Personal tasks", "Personal" },
                    { 2, "#10B981", "Work tasks", "Work" }
                });

            migrationBuilder.UpdateData(
                table: "TaskItems",
                keyColumn: "Id",
                keyValue: 1,
                column: "LabelId",
                value: 1);

            migrationBuilder.UpdateData(
                table: "TaskItems",
                keyColumn: "Id",
                keyValue: 2,
                column: "LabelId",
                value: 1);

            migrationBuilder.InsertData(
                table: "TaskItems",
                columns: new[] { "Id", "IsComplete", "LabelId", "Title" },
                values: new object[] { 3, false, 2, "Finish report" });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "Labels",
                keyColumn: "Id",
                keyValue: 1);

            migrationBuilder.DeleteData(
                table: "TaskItems",
                keyColumn: "Id",
                keyValue: 3);

            migrationBuilder.DeleteData(
                table: "Labels",
                keyColumn: "Id",
                keyValue: 2);

            migrationBuilder.UpdateData(
                table: "TaskItems",
                keyColumn: "Id",
                keyValue: 1,
                column: "LabelId",
                value: null);

            migrationBuilder.UpdateData(
                table: "TaskItems",
                keyColumn: "Id",
                keyValue: 2,
                column: "LabelId",
                value: null);
        }
    }
}
