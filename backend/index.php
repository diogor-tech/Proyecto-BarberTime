<?php
require_once __DIR__ . '/config/cors.php';
require_once __DIR__ . '/config/db.php';
require_once __DIR__ . '/config/jwt.php';

$database = new Database();
$db = $database->getConnection();

$request_uri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
$method = $_SERVER['REQUEST_METHOD'];
$data = json_decode(file_get_contents("php://input"), true) ?? $_POST;

// ------------------------------------------------------------------
// AUTHENTICATION (REGISTER / LOGIN)
// ------------------------------------------------------------------

// 1. REGISTRO DE USUARIO
if ($request_uri === '/api/auth/register' && $method === 'POST') {
    $email = trim($data['email'] ?? '');
    $password = trim($data['password'] ?? '');
    $name = trim($data['name'] ?? '');

    if (empty($email) || empty($password) || empty($name)) {
        http_response_code(400);
        echo json_encode(["message" => "Todos los campos obligatorios deben ser completados"]);
        exit();
    }

    $stmt = $db->prepare("SELECT id FROM usuarios WHERE email = ?");
    $stmt->execute([$email]);
    if ($stmt->fetch()) {
        http_response_code(400);
        echo json_encode(["message" => "Ese correo ya existe"]);
        exit();
    }

    $hashed_password = password_hash($password, PASSWORD_BCRYPT);
    $avatar = $data['avatar'] ?? 'https://drive.google.com/thumbnail?id=1Igq46CyxTBBX8AEimgfYxqmZrgcZLZqL&sz=w640';

    $stmt = $db->prepare("INSERT INTO usuarios (name, email, password, avatar) VALUES (?, ?, ?, ?)");
    $stmt->execute([$name, $email, $hashed_password, $avatar]);
    $userId = $db->lastInsertId();

    $userPayload = ["id" => $userId, "name" => $name, "email" => $email, "avatar" => $avatar];
    $token = JWTAuth::generateToken($userPayload);

    echo json_encode(["token" => $token, "user" => $userPayload]);
    exit();
}

// 2. LOGIN DE USUARIO
if ($request_uri === '/api/auth/login' && $method === 'POST') {
    $email = trim($data['email'] ?? '');
    $password = trim($data['password'] ?? '');

    $stmt = $db->prepare("SELECT * FROM usuarios WHERE email = ?");
    $stmt->execute([$email]);
    $user = $stmt->fetch();

    if (!$user || !password_verify($password, $user['password'])) {
        http_response_code(400);
        echo json_encode(["message" => "Credenciales incorrectas"]);
        exit();
    }

    unset($user['password']);
    $token = JWTAuth::generateToken($user);

    echo json_encode(["token" => $token, "user" => $user]);
    exit();
}

// ------------------------------------------------------------------
// PERFIL DE USUARIO
// ------------------------------------------------------------------

// 3. ACTUALIZAR PERFIL Y FOTO
if ($request_uri === '/api/usuario/perfil' && $method === 'PUT') {
    $token = JWTAuth::getBearerToken();
    $userData = JWTAuth::validateToken($token);

    if (!$userData) {
        http_response_code(401);
        echo json_encode(["message" => "No autorizado"]);
        exit();
    }

    $id = $userData['id'];
    $name = $data['name'] ?? '';
    $telefono = $data['telefono'] ?? '';
    $ciudad = $data['ciudad'] ?? '';
    $fechaNacimiento = $data['fechaNacimiento'] ?? null;
    $barberoFavorito = $data['barberoFavorito'] ?? '';
    $avatar = $data['avatar'] ?? null;

    $stmt = $db->prepare("UPDATE usuarios SET name = ?, telefono = ?, ciudad = ?, fecha_nacimiento = ?, barbero_favorito = ?, avatar = COALESCE(?, avatar) WHERE id = ?");
    $stmt->execute([$name, $telefono, $ciudad, $fechaNacimiento, $barberoFavorito, $avatar, $id]);

    $stmt = $db->prepare("SELECT id, name, email, telefono, ciudad, fecha_nacimiento, barbero_favorito, avatar FROM usuarios WHERE id = ?");
    $stmt->execute([$id]);
    $updatedUser = $stmt->fetch();

    echo json_encode(["message" => "Perfil actualizado", "user" => $updatedUser]);
    exit();
}

// ------------------------------------------------------------------
// BARBERÍAS Y SERVICIOS
// ------------------------------------------------------------------

// 4. OBTENER LISTA DE BARBERÍAS
if ($request_uri === '/api/barberias' && $method === 'GET') {
    $stmt = $db->query("SELECT b.*, COALESCE(AVG(r.estrellas), 0) AS rating_promedio FROM barberias b LEFT JOIN resenas r ON b.id = r.barberia_id GROUP BY b.id");
    $barberias = $stmt->fetchAll();

    foreach ($barberias as &$b) {
        $stmtServ = $db->prepare("SELECT nombre, precio FROM servicios WHERE barberia_id = ?");
        $stmtServ->execute([$b['id']]);
        $b['servicios'] = $stmtServ->fetchAll();
        $b['disponible'] = (bool)$b['disponible'];
    }

    echo json_encode($barberias);
    exit();
}

// 5. REGISTRAR O ACTUALIZAR BARBERÍA (Adaptado a BarberForm.vue)
if ($request_uri === '/api/barberias' && $method === 'POST') {
    $token = JWTAuth::getBearerToken();
    $userData = JWTAuth::validateToken($token);

    $usuario_id = $userData ? $userData['id'] : null;
    $nombre = $data['nombre'] ?? '';
    $direccion = $data['direccion'] ?? '';
    $ciudad = $data['ciudad'] ?? '';
    $telefono = $data['telefono'] ?? '';
    $horario = $data['horario'] ?? '';
    $descripcion = $data['descripcion'] ?? '';
    $imagen = $data['imagen'] ?? '';
    $disponible = isset($data['disponible']) ? ($data['disponible'] ? 1 : 0) : 1;
    $servicios = $data['servicios'] ?? [];

    $stmt = $db->prepare("INSERT INTO barberias (usuario_id, nombre, direccion, ciudad, telefono, horario, descripcion, imagen, disponible) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)");
    $stmt->execute([$usuario_id, $nombre, $direccion, $ciudad, $telefono, $horario, $descripcion, $imagen, $disponible]);
    $barberia_id = $db->lastInsertId();

    foreach ($servicios as $serv) {
        $stmtServ = $db->prepare("INSERT INTO servicios (barberia_id, nombre, precio) VALUES (?, ?, ?)");
        $stmtServ->execute([$barberia_id, $serv['nombre'], $serv['precio']]);
    }

    echo json_encode(["message" => "Barbería creada exitosamente", "id" => $barberia_id]);
    exit();
}

// ------------------------------------------------------------------
// RESEÑAS Y ESTRELLAS (1 A 5 STAR RATING)
// ------------------------------------------------------------------

// 6. CREAR RESEÑA
if ($request_uri === '/api/resenas' && $method === 'POST') {
    $token = JWTAuth::getBearerToken();
    $userData = JWTAuth::validateToken($token);

    if (!$userData) {
        http_response_code(401);
        echo json_encode(["message" => "Debes iniciar sesión para dejar una reseña"]);
        exit();
    }

    $barberia_id = $data['barberia_id'] ?? null;
    $estrellas = intval($data['estrellas'] ?? 5);
    $comentario = $data['comentario'] ?? '';

    if (!$barberia_id || $estrellas < 1 || $estrellas > 5) {
        http_response_code(400);
        echo json_encode(["message" => "Datos de reseña inválidos"]);
        exit();
    }

    $stmt = $db->prepare("INSERT INTO resenas (barberia_id, usuario_id, estrellas, comentario) VALUES (?, ?, ?, ?)");
    $stmt->execute([$barberia_id, $userData['id'], $estrellas, $comentario]);

    echo json_encode(["message" => "Reseña guardada correctamente"]);
    exit();
}

// 7. OBTENER RESEÑAS DE UNA BARBERÍA
if (preg_match('/^\/api\/barberias\/(\d+)\/resenas$/', $request_uri, $matches) && $method === 'GET') {
    $barberia_id = $matches[1];
    $stmt = $db->prepare("SELECT r.*, u.name AS usuario_nombre, u.avatar FROM resenas r JOIN usuarios u ON r.usuario_id = u.id WHERE r.barberia_id = ? ORDER BY r.created_at DESC");
    $stmt->execute([$barberia_id]);
    echo json_encode($stmt->fetchAll());
    exit();
}

// ------------------------------------------------------------------
// TIENDA Y CHECKOUT
// ------------------------------------------------------------------

// 8. OBTENER PRODUCTOS (Para StoreView.vue)
if ($request_uri === '/api/productos' && $method === 'GET') {
    $stmt = $db->query("SELECT * FROM productos ORDER BY id DESC");
    echo json_encode($stmt->fetchAll());
    exit();
}

// 9. PROCESAR COMPRA (Para CheckoutView.vue)
if ($request_uri === '/api/compras' && $method === 'POST') {
    $token = JWTAuth::getBearerToken();
    $userData = JWTAuth::validateToken($token);

    $usuario_id = $userData ? $userData['id'] : null;
    $nombre = $data['nombre'] ?? '';
    $telefono = $data['telefono'] ?? '';
    $direccion = $data['direccion'] ?? '';
    $metodo_pago = $data['pago'] ?? 'Tarjeta';
    $carrito = $data['carrito'] ?? [];

    if (empty($nombre) || empty($direccion) || empty($carrito)) {
        http_response_code(400);
        echo json_encode(["message" => "Información de compra incompleta"]);
        exit();
    }

    // Calcular Total
    $total = 0;
    foreach ($carrito as $item) {
        $precio = isset($item['discount']) && $item['discount'] > 0 
            ? round($item['price'] - ($item['price'] * $item['discount'] / 100)) 
            : $item['price'];
        $total += $precio * $item['cantidad'];
    }

    $stmt = $db->prepare("INSERT INTO compras (usuario_id, nombre_cliente, telefono, direccion, metodo_pago, total) VALUES (?, ?, ?, ?, ?, ?)");
    $stmt->execute([$usuario_id, $nombre, $telefono, $direccion, $metodo_pago, $total]);
    $compra_id = $db->lastInsertId();

    foreach ($carrito as $item) {
        $precio = isset($item['discount']) && $item['discount'] > 0 
            ? round($item['price'] - ($item['price'] * $item['discount'] / 100)) 
            : $item['price'];

        $stmtDet = $db->prepare("INSERT INTO detalles_compra (compra_id, producto_id, cantidad, precio_unitario) VALUES (?, ?, ?, ?)");
        $stmtDet->execute([$compra_id, $item['id'], $item['cantidad'], $precio]);

        // Restar Stock
        $stmtStock = $db->prepare("UPDATE productos SET stock = GREATEST(0, stock - ?) WHERE id = ?");
        $stmtStock->execute([$item['cantidad'], $item['id']]);
    }

    echo json_encode(["message" => "Compra realizada correctamente", "compra_id" => $compra_id]);
    exit();
}

// Ruta no encontrada
http_response_code(404);
echo json_encode(["message" => "Ruta API no encontrada"]);