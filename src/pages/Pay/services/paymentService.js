import CryptoJS from "crypto-js";

const PAYU_CONFIG = {
    API_KEY: "4Vj8eK4rloUd272L48hsrarnUA",
    API_LOGIN: "pRRXKOl8ikMmt9u",
    MERCHANT_ID: 508029,
    ACCOUNT_ID: 512323,
    URL_PAYU: "https://sandbox.api.payulatam.com/payments-api/4.0/service.cgi"
};

export const processFullPayment = async (formData, totalAmount) => {

    const amountFormatted = totalAmount.toFixed(2);
    const amountValue = Number(amountFormatted);

    const expiryClean = formData.expiryDate.replace(/\s/g, "");
    const [monthRaw, yearRaw] = expiryClean.split('/');
    const month = (monthRaw || "").padStart(2, "0");
    const year = (yearRaw || "").padStart(2, "0");
    const formattedExpirationDate = `20${year}/${month}`;

    const requestTime = new Date();
    const fechaLegible = requestTime.toISOString().split('T')[0];
    const referenceCode = `PRODUCT_TEST_${fechaLegible}_${requestTime.getTime()}`;

    const signatureText = `${PAYU_CONFIG.API_KEY}~${PAYU_CONFIG.MERCHANT_ID}~${referenceCode}~${amountFormatted}~PEN`;
    const signature = CryptoJS.MD5(signatureText).toString();

    const addressData = {
        street1: "Av. Isabel La Catolica 103-La Victoria",
        city: "Lima",
        state: "Lima y Callao",
        country: "PE",
        postalCode: "000000",
        phone: "7563126"
    };

    const buyerData = {
        fullName: formData.fullName,
        emailAddress: formData.email,
        contactPhone: "7563126",
        dniNumber: formData.docNumber,
        dniType: formData.docType,
        shippingAddress: addressData
    };

    const payerData = {
        fullName: formData.fullName,
        emailAddress: formData.email,
        contactPhone: "7563126",
        dniNumber: formData.docNumber,
        dniType: formData.docType,
        billingAddress: addressData
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
                    TX_VALUE: { value: amountFormatted, currency: "PEN" },
                    TX_TAX: { value: 0, currency: "PEN" },
                    TX_TAX_RETURN_BASE: { value: 0, currency: "PEN" }
                },
                buyer: buyerData,
                shippingAddress: addressData
            },
            payer: payerData,
            creditCard: {
                number: formData.cardNumber.replace(/\s/g, ''),
                securityCode: formData.cvv,
                expirationDate: formattedExpirationDate,
                name: formData.fullName
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