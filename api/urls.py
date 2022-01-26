
from django.urls import path
from .views import *
urlpatterns = [
path('room',RoomView.as_view()),
path('create_room',CreateRoomView.as_view()),
path('get_room',GetRoom.as_view()),
path('join-room',JoinRoom.as_view()),
path('user-in-room',UserInRoom.as_view()),
path('leave-room',LeaveRoom.as_view()),
path('update-room',UpdateRoom.as_view()),

]