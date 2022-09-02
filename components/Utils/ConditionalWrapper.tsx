type ConditionalWrapperProps = {
    children: React.ReactElement;
    condition: boolean;
    wrapper: (children: React.ReactElement) => JSX.Element;
};

const ConditionalWrapper = ({ condition, wrapper, children }: ConditionalWrapperProps): JSX.Element =>
    condition ? wrapper(children) : children;

export default ConditionalWrapper;
