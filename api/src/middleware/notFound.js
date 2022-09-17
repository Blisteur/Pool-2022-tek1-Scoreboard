function notFound(req, res)
{
    return (res.status(404).json({ "msg": "not found" }));
}

module.exports = {
    notFound
}