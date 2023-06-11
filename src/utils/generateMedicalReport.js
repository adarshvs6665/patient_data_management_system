const dayjs = require("dayjs");

const generateMedicalReport = (data, doc) => {
  const offsetForRectangleOutline = 30;
  const headingOffsetFromTop = 50;
  const headingOffsetFromLeft = 20;
  const pageSize = [612, 792];
  doc.page.width = pageSize[0];
  doc.page.height = pageSize[1];

  // logo
  doc.image("assets/images/logo.jpg", {
    fit: [50, 50],
    align: "center",
    valign: "center",
    x: 90 + headingOffsetFromLeft,
    y: 0 + headingOffsetFromTop,
  });

  // heading
  doc
    .fontSize(20)
    .text(
      "Patient Data Management System",
      150 + headingOffsetFromLeft,
      15 + headingOffsetFromTop
    );
  doc
    .fontSize(10)
    .text(
      "Information Tecnology Department, 8th semester, UCEK",
      150 + headingOffsetFromLeft,
      40 + headingOffsetFromTop
    );

  // 'Medical Report' - heading
  const reportText = "Medical Report";
  doc
    .fontSize(14)
    .lineCap("butt")
    .dash(1, { space: 2 })
    .moveTo(
      (doc.page.width - doc.widthOfString(reportText, { size: 14 })) / 2 - 20,
      215 + 1 / 2
    )
    .lineTo(
      (doc.page.width - doc.widthOfString(reportText, { size: 14 })) / 2 -
        20 +
        95,
      215 + 1 / 2
    )
    .lineWidth(1)
    .stroke()
    .undash()
    .text(
      reportText,
      (doc.page.width - doc.widthOfString(reportText, { size: 14 })) / 2 - 20,
      200
    );

  const headerHeight = 300;
  const reportDetailsMargin = 75;
  const spaceAfterColon = 5;
  const colonBefore = ":" + " ".repeat(spaceAfterColon);

  doc
    .fontSize(10)
    .text("Report ID", reportDetailsMargin, 260)
    .text("Generated On", reportDetailsMargin, 280);

  doc
    .fontSize(10)
    .text(
      data.reportId ? colonBefore + data.reportId : colonBefore + "Nil",
      reportDetailsMargin + 100,
      260
    )
    .text(
      colonBefore + dayjs().format("DD/MM/YYYY").toString(),
      reportDetailsMargin + 100,
      280
    );

  doc.moveDown(300);

  // making all font bold
  doc.font("Helvetica-Bold");

  const descriptionHeight =
    doc.heightOfString(data.description ? data.description : 'Nil', {
      width: doc.page.width - 180 - reportDetailsMargin,
    }) - 10;
  const medicationHeight =
    doc.heightOfString(data.medication ? data.medication : 'Nil', {
      width: doc.page.width - 180 - reportDetailsMargin,
    }) - 10;

  doc
    .fontSize(10)
    .text("Patient name", reportDetailsMargin, headerHeight + 40)
    .text("Reason for visit", reportDetailsMargin, headerHeight + 60)
    .text("Diagnosed with", reportDetailsMargin, headerHeight + 80)
    .text("Description", reportDetailsMargin, headerHeight + 100)
    .text(
      "Medication",
      reportDetailsMargin,
      headerHeight + 120 + descriptionHeight
    )
    .text(
      "Doctor",
      reportDetailsMargin,
      headerHeight + 140 + descriptionHeight + medicationHeight
    )
    .text(
      "Hospital",
      reportDetailsMargin,
      headerHeight + 160 + descriptionHeight + medicationHeight
    )
    .text(
      "Date",
      reportDetailsMargin,
      headerHeight + 180 + descriptionHeight + medicationHeight
    );

  // making all font normal
  doc.font("Helvetica");

  // Display report data

  doc
    .text(
      data.name ? colonBefore + data.name : colonBefore + "Nil",
      reportDetailsMargin + 100,
      headerHeight + 60 - 20
    )
    .text(
      data.causeOfVisit ? colonBefore + data.causeOfVisit : colonBefore + "Nil",
      reportDetailsMargin + 100,
      headerHeight + 80 - 20
    )
    .text(
      data.condition ? colonBefore + data.condition : colonBefore + "Nil",
      reportDetailsMargin + 100,
      headerHeight + 100 - 20
    )
    .text(
      data.description ? colonBefore + data.description : colonBefore + "Nil",
      reportDetailsMargin + 100,
      headerHeight + 120 - 20,
      {
        width: doc.page.width - 180 - reportDetailsMargin,
        align: "justify",
      }
    )
    .text(
      data.medication ? colonBefore + data.medication : colonBefore + "Nil",
      reportDetailsMargin + 100,
      headerHeight + 120 + descriptionHeight,
      { width: doc.page.width - 180 - reportDetailsMargin, align: "justify" }
    )
    .text(
      data.doctor ? colonBefore + data.doctor : colonBefore + "Nil",
      reportDetailsMargin + 100,
      headerHeight + 120 + descriptionHeight + 20 + medicationHeight
    )
    .text(
      data.hospitalName ? colonBefore + data.hospitalName : colonBefore + "Nil",
      reportDetailsMargin + 100,
      headerHeight + 120 + descriptionHeight + 40 + medicationHeight
    )
    .text(
      data.dateOfVisit ? colonBefore + data.dateOfVisit : colonBefore + "Nil",
      reportDetailsMargin + 100,
      headerHeight + 120 + descriptionHeight + 60 + medicationHeight
    );

  // draw bounding rectangle
  doc
    .rect(
      30,
      30,
      doc.page.width - offsetForRectangleOutline * 2,
      doc.page.height - offsetForRectangleOutline * 2
    )
    .stroke();

  // Set font to bold
  doc.font("Helvetica-Bold");
  doc.text("Place", reportDetailsMargin, doc.page.height - 150);
  doc.moveDown(0.5);
  // Set font to bold
  doc.font("Helvetica");
  doc.text("Kerala, India", reportDetailsMargin);

  // authorised signature
  // Set font to bold
  doc.font("Helvetica-Bold");
  doc.text("Authorised Signature", 430, doc.page.height - 150);
  // verification
  doc.image("assets/images/signature.jpg", {
    fit: [100, 100],
    align: "center",
    valign: "center",
    x: 430,
    y: doc.page.height - 150 + 10,
  });

  doc.image("assets/images/verified.jpg", {
    fit: [120, 120],
    align: "center",
    valign: "center",
    x: 430,
    y: doc.page.height - 160 + 10,
  });
};

module.exports = {
  generateMedicalReport,
};
