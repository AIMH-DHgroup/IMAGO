from django import template  
import time 
import datetime

register = template.Library()    

@register.filter('timestamp_to_time')
def convert_timestamp_to_time(timestamp):
    # return timestamp
    return datetime.datetime.fromtimestamp(timestamp).strftime('%d/%m/%Y')
