import jwt from 'jsonwebtoken';

// Middleware para autenticação
const authMiddleware = (req, res, next) => {
    // Obtém o cabeçalho de autorização
    const authHeader = req.headers['authorization'];
    const userID = req.headers['user'];
    // console.log(authHeader)
    // console.log('o id aqui>>>',userID)

    // Verifica se o cabeçalho está presente e tem o formato esperado
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Access denied. No token provided.' });
    }

    // Extrai o token do cabeçalho
    const token = authHeader.split(' ')[1]; // ou replace('Bearer ', '') se preferir

    try {
        // Verifica e decodifica o token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Adiciona a informação decodificada ao objeto req
        req.user = decoded;

        // Passa para o próximo middleware ou rota
        next();
    } catch (ex) {
        // Retorna erro se o token for inválido
        res.status(401).json({ message: 'invalid token'});
    }
};

export default authMiddleware;
