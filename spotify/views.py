from email import header
from os import access
from re import A
from django.http import response
from django.shortcuts import render,redirect
from .credentials import REDIRECT_URI,CLIENT_SECRET,CLIENT_ID
from rest_framework.views import APIView
from requests import Request,post,Session,put,get
# Create your views here.
from rest_framework import status
from rest_framework.response import Response
from .util import *
import requests
from api.models import Room


class AuthURL(APIView):
    def get(self,request,format=None):
        s = Session()
        scopes='user-read-playback-state user-modify-playback-state user-read-currently-playing'
        req=Request('GET','https://accounts.spotify.com/authorize',params={
            'scope':scopes,
            'response_type':'code',
            'redirect_uri':REDIRECT_URI,
            'client_id':CLIENT_ID
        })
        prepped = s.prepare_request(req)
        
        # url=requests.get('https://accounts.spotify.com/authorize',params={
        #     'scope':scopes,
        #     'response_type':'code',
        #     'redirect_uri':REDIRECT_URI,
        #     'client_id':CLIENT_ID
        # })
        
        print(prepped.url)
        return Response({"url":prepped.url},status=status.HTTP_200_OK)


def spotify_callback(request,format=None):
    code=request.GET.get('code')
    error=request.GET.get('error')
    response=post('https://accounts.spotify.com/api/token',data={
        'grant_type':'authorization_code',
        'code':code,
        'redirect_uri':REDIRECT_URI,
        'client_id':CLIENT_ID,
        'client_secret':CLIENT_SECRET
    }).json()
    
    access_token=response.get('access_token')
    token_type=response.get('token_type')
    refresh_token=response.get('refresh_token')
    expires_in=response.get('expires_in')
    error=response.get('error')
    if not request.session.exists(request.session.session_key):
        request.session.create()
    update_token_or_create_user_tokens(request.session.session_key,access_token,token_type,expires_in,refresh_token)
    return redirect('frontend:home')


class IsAuthenticated(APIView):
    def get(self,request,format=None):
        is_authentcated=is_spotify_authenticated(request.session.session_key)
        return Response({'status':is_authentcated},status=status.HTTP_200_OK)
    


class CurrentSong(APIView):
    def get(self,request,format=None):
        room_code=self.request.session.get('room_code')
        room=Room.objects.filter(code=room_code)
        if room.exists():
            room=room[0]
        else:
            return Response({},status=status.HTTP_400_BAD_REQUEST)
        host =room.host
        endpoint="player/currently-playing"
        response=execute_spotify_api_request(host,endpoint)
        if 'error' in response or 'item' not in response:
            return Response({},status=status.HTTP_204_NO_CONTENT)
        item=response.get('item')
        progress=response.get('progress_ms')
        is_playing=response.get('is_playing')
        duration=item.get('duration_ms')
        album_cover=item.get('images')[0].get('url')
        song_id=item.get('id')
        artist_string=""
        for i,artist in enumerate(item.get('artist')):
            if i>0:
                artist_string  +=", "
            name=artist.get('name')
            artist_string +=name
        song={
            'title':item.get('name'),
            'artist':artist_string,
            'duration':duration,
            'time':progress,
            'image_url':album_cover,
            'is_playing':is_playing,
            'votes':0,
            'id':song_id
        }
        return Response(song,status=status.HTTP_200_OK)

