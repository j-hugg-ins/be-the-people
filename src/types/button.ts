export interface ButtonProps {
    text: string;
    variant?: 'primary' | 'secondary';
    size?: 'small' | 'medium' | 'large';
    type?: 'button' | 'submit' | 'reset';
    disabled?: boolean;
    onClick?: () => void;
    children?: React.ReactNode;
}
