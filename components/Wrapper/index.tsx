const PageWrapper = ({children}) => {
    return (
        <div className="flex flex-col relative">
            {children}
        </div>
    )
}

export default PageWrapper;
