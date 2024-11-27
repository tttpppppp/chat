let data = [

]

const userList = (room) => data.filter(d => d.room == room);

const addUser = (newUser) => (data = [...data , newUser]);

const removeUser = (id) => (data = data.filter(u => u.id !== id ))

const findUser = (id) => data.find((user) => user.id == id);


module.exports = {userList , addUser , removeUser , findUser};