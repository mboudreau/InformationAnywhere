import urllib2
import ssl
from xml.dom.minidom import *
import os
import re
import xml.sax
import base64
from bottle import route, run, static_file

url = 'https://10.10.20.11/api/contextaware/v1/location/clients'
ssl._create_default_https_context = ssl._create_unverified_context

@route('/location')
def cmx_api():
	try:
		auth = base64.b64encode('learning:learning')
		headers = {'Authorization ':'Basic '+auth}
		request = urllib2.Request(url,None,headers)
		response = urllib2.urlopen(request)
		data = response.read()
		response.close()
		dom = xml.dom.minidom.parseString(data)
		locationNode =  dom.firstChild
		refNode = locationNode.childNodes[1]
		pnode = refNode.childNodes[1]
		print pnode.toxml()
		# print dom
	except urllib2.URLError, e:
	  print "Error while opening url!!"
	  print e

run(host='', port=8080, debug=True)