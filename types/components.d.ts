import type { ReactElement, ComponentPropsWithRef } from "react";
import type { HTMLMotionProps } from "framer-motion";

declare global {
  namespace JSX {
    interface IntrinsicElements {
      div: React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLDivElement>,
        HTMLDivElement
      >;
      label: React.DetailedHTMLProps<
        React.LabelHTMLAttributes<HTMLLabelElement>,
        HTMLLabelElement
      >;
      input: React.DetailedHTMLProps<
        React.InputHTMLAttributes<HTMLInputElement>,
        HTMLInputElement
      >;
      textarea: React.DetailedHTMLProps<
        React.TextareaHTMLAttributes<HTMLTextAreaElement>,
        HTMLTextAreaElement
      >;
      button: React.DetailedHTMLProps<
        React.ButtonHTMLAttributes<HTMLButtonElement>,
        HTMLButtonElement
      >;
      form: React.DetailedHTMLProps<
        React.FormHTMLAttributes<HTMLFormElement>,
        HTMLFormElement
      >;
      "motion.div": HTMLMotionProps<"div">;
      "motion.form": HTMLMotionProps<"form">;
      "motion.button": HTMLMotionProps<"button">;
    }
  }
}

export interface FormData {
  name: string;
  email: string;
  message: string;
}

export type InputProps = ComponentPropsWithRef<"input">;
export type TextAreaProps = ComponentPropsWithRef<"textarea">;

export interface FormFieldProps extends ComponentPropsWithRef<"input"> {
  label: string;
  id: string;
  name: string;
  type?: string;
  value: string;
  onChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  placeholder?: string;
  disabled?: boolean;
  isTextArea?: boolean;
  className?: string;
}
