
from unicodedata import name
from django.urls import path
from .views import *

app_name='frontend'

urlpatterns = [
path('',index,name="home"),
path('join',index),
path('create',index),
path('room/<str:roomCode>',index),
]