const driveImage = (id) => `https://drive.google.com/thumbnail?id=${id}&sz=w1200`

const products = [
	{
		id: 1,
		name: "Peines BarberTime",
		brand: "BarberTime",
		category: "Accesorios",
		price: 590,
		discount: 0,
		rating: 5,
		stock: 30,
		featured: true,
		image: driveImage("1L9Ar9WslE1Xpu_ojkBDlLSIkjmvjlBN_")
	},
	{
		id: 2,
		name: "Camisa oficial de BarberTime",
		brand: "BarberTime",
		category: "Ropa",
		price: 1290,
		discount: 0,
		rating: 5,
		stock: 20,
		featured: true,
		image: driveImage("1EEF-0UWg9_WeH8GgSdSADlmc9u_3_gcQ")
	},
	{
		id: 3,
		name: "Gorros oficiales de BarberTime",
		brand: "BarberTime",
		category: "Ropa",
		price: 890,
		discount: 0,
		rating: 5,
		stock: 25,
		featured: true,
		image: driveImage("11J4iyRVASVT-E_qkGraDqughsOv5HFsq")
	},
	{
		id: 4,
		name: "Riñoneras BarberTime",
		brand: "BarberTime",
		category: "Accesorios",
		price: 990,
		discount: 0,
		rating: 5,
		stock: 18,
		featured: true,
		image: driveImage("15x8jaPjSRz7Z2OubJW6zuVugW4nFgFsP")
	},
	{
		id: 5,
		name: "Pegatinas BarberTime",
		brand: "BarberTime",
		category: "Accesorios",
		price: 290,
		discount: 0,
		rating: 5,
		stock: 50,
		featured: true,
		image: driveImage("12hgmhoe_Rrze_x3XRge0USlcRk6ZfU97")
	},
	{
		id: 6,
		name: "Rasuradora BarberTime",
		brand: "BarberTime",
		category: "Herramientas",
		price: 3490,
		discount: 0,
		rating: 5,
		stock: 12,
		featured: true,
		image: driveImage("11sabfWmVd3dHhR3BJq0PS8suW-hS3iOh")
	}
]

export default products