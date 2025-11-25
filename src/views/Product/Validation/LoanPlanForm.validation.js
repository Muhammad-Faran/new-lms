import * as yup from "yup";

export const loanPlanFormSchema = yup.object({
    product_tier: yup
        .object()
        .test(
            "notEmpty",
            "Product tier cannot be an empty.",
            (value) => value && Object.keys(value).length > 0
        )
        .required("Product tier is required."),
    //   product_tier_id: yup
    //     .number()
    //     .typeError("Product tier ID must be a number.")
    //     .nullable()
    //     .required("Product tier ID is required."),
    name: yup
        .string()
        .required("Plan name is required.")
        .max(100, "Plan name cannot exceed 100 characters."),
    duration_unit: yup
        .string()
        .oneOf(["days", "months", "years"], "Invalid duration unit.")
        .required("Duration unit is required."),
    duration_value: yup
        .number()
        .typeError("Duration value must be a number.")
        .positive("Duration value must be greater than 0.")
        .required("Duration value is required."),
    status: yup
        .string()
        .oneOf(["1", "0"], "Invalid status.")
        .required("Status is required."),
});
