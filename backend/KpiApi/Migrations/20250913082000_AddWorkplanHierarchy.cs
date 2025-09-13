using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace KpiApi.Migrations
{
    /// <inheritdoc />
    public partial class AddWorkplanHierarchy : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "ReviewComments",
                table: "Workplans",
                type: "longtext",
                nullable: true)
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AddColumn<DateTime>(
                name: "ReviewedAt",
                table: "Workplans",
                type: "datetime(6)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Status",
                table: "Workplans",
                type: "longtext",
                nullable: false,
                defaultValue: "Draft")
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AddColumn<string>(
                name: "SubmittedToId",
                table: "Workplans",
                type: "varchar(255)",
                nullable: true)
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateIndex(
                name: "IX_Workplans_SubmittedToId",
                table: "Workplans",
                column: "SubmittedToId");

            migrationBuilder.AddForeignKey(
                name: "FK_Workplans_AspNetUsers_SubmittedToId",
                table: "Workplans",
                column: "SubmittedToId",
                principalTable: "AspNetUsers",
                principalColumn: "Id",
                onDelete: ReferentialAction.SetNull);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Workplans_AspNetUsers_SubmittedToId",
                table: "Workplans");

            migrationBuilder.DropIndex(
                name: "IX_Workplans_SubmittedToId",
                table: "Workplans");

            migrationBuilder.DropColumn(
                name: "ReviewComments",
                table: "Workplans");

            migrationBuilder.DropColumn(
                name: "ReviewedAt",
                table: "Workplans");

            migrationBuilder.DropColumn(
                name: "Status",
                table: "Workplans");

            migrationBuilder.DropColumn(
                name: "SubmittedToId",
                table: "Workplans");
        }
    }
}