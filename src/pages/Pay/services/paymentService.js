import CryptoJS from "crypto-js";

const PAYU_CONFIG = {
    API_KEY: "4Vj8eK4rloUd272L48hsrarnUA",
    API_LOGIN: "pRRXKOl8ikMmt9u",
    MERCHANT_ID: "508029",
    ACCOUNT_ID: "512323",
    URL_PAYU: "https://sandbox.api.payulatam.com/payments-api/4.0/service.cgi"
};

export const processFullPayment = async (formData, totalAmount) => {

    const amountValue = parseFloat(totalAmount.toFixed(1));
    const amountStr = amountValue.toString();

    const [month, year] = formData.expiryDate.split('/');
    const formattedExpirationDate = `20${year}/${month}`;

    const fecha = new Date();
    const fechaLegible = fecha.toISOString().split('T')[0];
    const referenceCode = `PRODUCT_TEST_${fechaLegible}`;

    const signatureText = `${PAYU_CONFIG.API_KEY}~${PAYU_CONFIG.MERCHANT_ID}~${referenceCode}~${amountStr}~PEN`;
    const signature = CryptoJS.MD5(signatureText).toString();

    const buyerAndPayerData = {

        fullName: formData.fullName,
        emailAddress: formData.email,
        contactPhone: "7563126",
        dniNumber: formData.docNumber,
        shippingAddress: {
            street1: "Av. Isabel La Católica 103-La Victoria",
            street2: "125544",
            city: "Lima",
            state: "Lima y Callao",
            country: "PE",
            postalCode: "000000",
            phone: "7563126"

        }
    };

    const payload = {
        language: "es",
        command: "SUBMIT_TRANSACTION",
        merchant: {
            apiKey: PAYU_CONFIG.API_KEY,
            apiLogin: PAYU_CONFIG.API_LOGIN
        },
        transaction: {
            order: {
                accountId: PAYU_CONFIG.ACCOUNT_ID,
                referenceCode: referenceCode,
                description: "Payment test description",
                language: "es",
                signature: signature,
                notifyUrl: "http://www.payu.com/notify",
                additionalValues: {
                    TX_VALUE: { value: amountValue, currency: "PEN" }
                },
                buyer: buyerAndPayerData,
                shippingAddress: buyerAndPayerData.shippingAddress
            },
            payer: buyerAndPayerData,
            creditCard: {
                number: formData.cardNumber.replace(/\s/g, ''),
                securityCode: formData.cvv,
                expirationDate: formattedExpirationDate,
                name: "APPROVED"
            },
            extraParameters: {
                "INSTALLMENTS_NUMBER": 1
            },
            type: "AUTHORIZATION_AND_CAPTURE",
            paymentMethod: "VISA",
            paymentCountry: "PE",
            deviceSessionId: "vghs6tvkcle931686k1900o6e1",
            ipAddress: "127.0.0.1",
            cookie: "pt1t38347bs6jc9ruv2ecpv7o2",
            userAgent: navigator.userAgent
        },
        test: true
    }

    console.log("Datos para PayU:", {
        referenceCode,
        signature,
        amountValue,
        payload
    });

    const payuResponse = await fetch(PAYU_CONFIG.URL_PAYU, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify(payload)
    });

    const payuData = await payuResponse.json();

    if (payuData.transactionResponse?.state !== "APPROVED") {
        const errorMsg = payuData.transactionResponse?.paymentNetworkResponseErrorMessage ||
            payuData.transactionResponse?.responseCode ||
            "Transacción rechazada";
        throw new Error(errorMsg);
    }


    const { operationDate, transactionId } = payuData.transactionResponse;

    const completePayload = {
        email: formData.email,
        nombres: formData.fullName,
        dni: formData.docNumber,
        operationDate: operationDate,
        transactionId: transactionId
    };

    console.log("Enviando a servicio complete:", completePayload);

    return new Promise((resolve) => {
        setTimeout(() => {
            resolve({
                code: "0",
                message: "Transacción terminada con éxito"
            });
        }, 800);
    });
};