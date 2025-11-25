import * as yup from "yup";

export const schemaBasicInformation = yup.object({
    name: yup.string().required("Name is required."),
    code: yup.string().required("Code is required."),
    limit: yup
        .number()
        .typeError("Limit must be a number.")
        .positive("Limit must be a positive number.")
        .min(1, "Limit must be at least 1.")
        .required("Limit is required."),
    max_requested_amount: yup
        .number()
        .nullable()
        .required("Maximum Requested Loan Amount is required.")
        .min(
            yup.ref("min_requested_amount"),
            "Max Loan Amount must be greater than or equal to Min Loan Amount."
        )
        .typeError("Max Loan Amount must be a number."),
    min_requested_amount: yup
        .number()
        .nullable()
        .required("Minimum Requested Loan Amount is required.")
        .max(
            yup.ref("max_requested_amount"),
            "Min Loan Amount must be less than or equal to Max Loan Amount."
        )
        .typeError("Min Loan Amount must be a number."),
    tnc: yup
        .string()
        .required("Terms URL is required.")
        .required("Terms URL is required."),
    description: yup
        .string().required("Description is required.")
        .max(500, "Description cannot exceed 500 characters."),
    avatar: yup
        .mixed()
        .nullable()
        .required("image is required."),
    product_books: yup
        .array()
        .test(
            "minItems",
            "At least one product book must be selected.",
            (value) => value && value.length > 0
        ),
    product_tier_charges: yup
        .array()
        .test(
            "minItems",
            "At least one product tier charge must be selected.",
            (value) => value && value.length > 0
        ),
});