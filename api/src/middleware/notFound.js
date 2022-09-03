function notFound(req, res)
{
    return (res.status(404));
}

module.exports = {
    notFound
}