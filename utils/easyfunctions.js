exports.throwNewError = (errorMessage, errorStatus, errorData) => {
    const error = new Error(errorMessage || "An erro occured!")
    error.status = errorStatus || 500
    error.data = errorData || []

    return error
}