const Backdrop = (): JSX.Element => {
    return (
        <>
            <div className="backdrop fixed w-full h-full top-0 right-0" />
            <style jsx>{`
                .backdrop {
                    background-color: rgba(0, 0, 0, 0.8);
                    z-index: 100;
                }
            `}</style>
        </>
    );
};

export default Backdrop;
