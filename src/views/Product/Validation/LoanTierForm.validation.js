import * as yup from "yup";

export const productTierChargeSchema = yup.object({
    charge: yup
        .object()
        .test(
            'notEmpty',
            'Charge is required.',
            (value) => value && Object.keys(value).length > 0
        )
        .required('Charge is required.'),

    charges_unit: yup
        .string()
        .oneOf(["percentage", "fixed"], "Invalid charges unit.")
        .required("Charges unit is required."),

   charges_value: yup
    .number()
    .nullable()
    .typeError("Charges value must be a number.")
    .min(0, "Charges value must be at least 0.") // Allows 0 and above
    .required("Charges value is required.")
    .test(
        "conditional-validation-charges",
        "Charges value must be between 0.01 and 100 for percentage or have no max limit for fixed.",
        function (value) {
            const { charges_unit } = this.parent;
            
            // If charges_unit is percentage, allow values between 0.01 and 100
            if (charges_unit === "percentage") {
                return value >= 0.01 && value <= 100;
            }
            
            // For fixed, any value >= 0 is acceptable (including floats)
            return value >= 0;
        }
    ),

});

export const loanTierSchema = yup.object({
    name: yup.string().required("Name is required."),

    // fed_charge_unit: yup
    //     .string()
    //     .oneOf(["percentage", "fixed"], "Invalid charge unit.")
    //     .required("FED charge unit is required."),

    // fed_charges_value: yup
    //     .number()
    //     .nullable() // Allow null values initially
    //     .typeError("FED charges value must be a number.")
    //     .min(0, "FED charges value must be at least 0.")
    //     .required("FED charges value is required.")
    //     .test(
    //         "conditional-validation", // Name of the test
    //         "FED charges value must be between 1 and 100 for percentage or have no max limit for fixed.", // Error message
    //         function (value) {
    //             const { fed_charge_unit } = this.parent; // Access other fields in the same object
    //             if (fed_charge_unit === "percentage") {
    //                 return value >= 1 && value <= 100; // Validate for percentage
    //             }
    //             return true; // No additional validation for "fixed"
    //         }
    //     ),

    penalty_charges_unit: yup
        .string()
        .oneOf(["percentage", "fixed"], "Invalid penalty charge unit.")
        .required("Penalty charges unit is required."),

    penalty_charges_value: yup
        .number()
        .nullable()
        .typeError("Penalty charges value must be a number.")
        .min(0, "Penalty charges value must be at least 0.")
        .required("Penalty charges value is required.")
        .test(
            "conditional-validation-penalty",
            "Penalty charges value must be between 1 and 100 for percentage or have no max limit for fixed.",
            function (value) {
                const { penalty_charges_unit } = this.parent;
                if (penalty_charges_unit === "percentage") {
                    return value >= 1 && value <= 100;
                }
                return true;
            }
        ),

    installment_grace_period: yup
        .number()
        .typeError("Installment grace period must be a number.")
        .min(0, "Installment grace period must be at least 0.")
        .required("Installment grace period is required."),

    installment_defaulter_days: yup
        .number()
        .typeError("Installment defaulter days must be a number.")
        .min(0, "Installment defaulter days must be at least 0.")
        .required("Installment defaulter days are required."),

    status: yup
        .string()
        .oneOf(["1", "0"], "Invalid status.")
        .required("Status is required."),

    product_tier_charges: yup
        .array()
        .of(productTierChargeSchema)
        .min(1, "At least one product loan tier charge is required."),
});
