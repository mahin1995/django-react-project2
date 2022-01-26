from cmath import exp
import imp
from .credentials import REDIRECT_URI,CLIENT_SECRET,CLIENT_ID
from django.http import response
from .models import SpotifyToken
from django.utils import timezone
from datetime import timedelta
from requests import post,put,get
import requests

BASE_URL="https://api.spotify.com/v1/me/"


def get_user_tokens(session_id):
    user_tokens=SpotifyToken.objects.filter(user=session_id)
    if user_tokens.exists():
        return user_tokens[0]
    else:
        return None

def update_token_or_create_user_tokens(session_id,access_token,token_type,expires_in,refresh_token):
    tokens=get_user_tokens(session_id)
    expires_in=timezone.now()+timedelta(seconds=3600)
    if tokens:
        tokens.access_token=access_token
        tokens.refresh_token=refresh_token
        tokens.expires_in=expires_in
        tokens.token_type=token_type
        tokens.save(update_fields=['access_token','refresh_token','expires_in','token_type'])
    else:
        tokens=SpotifyToken(user=session_id,access_token=access_token,refresh_token=refresh_token,expires_in=expires_in,token_type=token_type)
        tokens.save()

def is_spotify_authenticated(session_id):
    tokens=get_user_tokens(session_id)
    if tokens:
        expiry=tokens.expires_in
        if expiry <= timezone.now():
            refresh_spotify_token(session_id)
        return True
    return False
from requests import Request,post
def refresh_spotify_token(session_id):
    refresh_token=get_user_tokens(session_id).refresh_token
    response =post('https://accounts.spotify.com/api/token',data={
        'grant_type':'refresh_token',
        'refresh_token':refresh_token,
        'client_id':CLIENT_ID,
        'client_secret':CLIENT_SECRET
    }).json()
    access_token=response.get('access_token')
    token_type=response.get('token_type')
    refresh_token=response.get('refresh_token')
    expires_in=response.get('expires_in')
    update_token_or_create_user_tokens(session_id,access_token,token_type,expires_in,refresh_token)
    # error=response.get('error')

import json
def execute_spotify_api_request(session_id,endpoint,post_=False,put_=False):
    tokens=get_user_tokens(session_id)
    headers={'Content-type':'application/json','Authorization':"Bearer "+tokens.access_token}
    
    if post_:
        post(BASE_URL+endpoint,headers=headers)
    if put_:
        put(BASE_URL+endpoint,headers=headers)
    # response=get(BASE_URL+endpoint,{},headers=headers)
    url=BASE_URL+endpoint
    response =requests.get(url, headers = headers)
    # print(response.json())
    # print(json.loads(response))
    try:
        return response
    except Exception as e:
        return {'Error':"Issue with request...."+str(e)}