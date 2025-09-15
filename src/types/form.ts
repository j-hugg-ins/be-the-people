export interface FormData {
    name: string;
    organization: string;
    email: string;
    location: string;
    excitement: string;
    consent: boolean;
    newsletter: boolean;
}

export interface FormMessage {
    type: 'success' | 'error';
    text: string;
}

export interface ModalFormProps {
    isOpen?: boolean;
    onClose?: () => void;
    onSubmissionSuccess?: () => void;
}
