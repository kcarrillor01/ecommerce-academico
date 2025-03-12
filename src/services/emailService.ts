import emailjs from "emailjs-com";

export const emailService = async (shippingData: any, orderDetails: any) => {
  try {
    const templateParams = {
      to_email: shippingData.email,
      to_name: shippingData.name || "Cliente",
      address: shippingData.address,
      phone: shippingData.phone,
      order_summary: JSON.stringify(orderDetails, null, 2), // Puedes formatearlo según necesites
      total: orderDetails.total.toLocaleString("es-CO", {
        style: "currency",
        currency: "COP",
      }),
    };

    await emailjs.send(
      "service_qww03ix", // Reemplaza con tu Service ID
      "template_3gahmqp", // Reemplaza con tu Template ID
      templateParams,
      "ze16v0zTg70vpAzMR" // Reemplaza con tu User ID public ID
    );
    console.log("Correo enviado exitosamente");
  } catch (error) {
    console.error("Error al enviar correo:", error);
  }
};
