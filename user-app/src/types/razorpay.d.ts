declare module 'react-native-razorpay' {
    interface RazorpayOptions {
        description?: string;
        image?: string;
        currency: string;
        key: string;
        amount: number;
        name: string;
        order_id?: string;
        prefill?: {
            email?: string;
            contact?: string;
            name?: string;
        };
        theme?: {
            color?: string;
        };
        notes?: Record<string, string>;
    }

    interface RazorpaySuccessResponse {
        razorpay_payment_id: string;
        razorpay_order_id?: string;
        razorpay_signature?: string;
    }

    interface RazorpayErrorResponse {
        code: string;
        description: string;
    }

    const RazorpayCheckout: {
        open(options: RazorpayOptions): Promise<RazorpaySuccessResponse>;
    };

    export default RazorpayCheckout;
}
