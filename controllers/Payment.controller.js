const stripe = require("../config/configStripe");

const payment = async (req, res) => {
  // Crea un token de pago
  try {
    const tokenDePago = await stripe.tokens.create({
      card: {
        number: "4242424242424242", // Número de la tarjeta de prueba de Stripe
        exp_month: 12, // Mes de vencimiento de la tarjeta de prueba de Stripe
        exp_year: 2022, // Año de vencimiento de la tarjeta de prueba de Stripe
        cvc: "123", // Código de seguridad de la tarjeta de prueba de Stripe
      },
    });

    // Procesa el pago
    const pago = await stripe.charges.create({
      amount: 4400, // La cantidad de la transacción en centavos
      currency: "mxn", // La moneda de la transacción
      source: tokenDePago.id, // El token de pago generado por Stripe
      description: "Pago de prueba", // Una descripción de la transacción
    });

    console.log(pago); // Muestra los detalles del pago en la consola

    res.send("Pago realizado con éxito");
  } catch (error) {
    console.error(error); // Muestra el error en la consola

    res.send("Error al realizar el pago");
  }
};

const refound = async (req, res) => {
  const result = await stripe.refunds.create({
    charge: "ch_3MIedBKIMXWjyb0R0Kob4fs5",
  });
  res.status(200).json({
    ok: true,
  });
};

module.exports = { payment, refound };
