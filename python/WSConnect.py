async_mode = None

from flask import Flask, render_template
import socketio

sio = socketio.Server(logger=True, async_mode=async_mode)
app = Flask(__name__)
application = app
app.wsgi_app = socketio.Middleware(sio, app.wsgi_app)


@sio.on('connect', namespace='/WSConnect')
def Connect(sid, environ):
    sio.enter_room(sid, "Template", namespace='/WSConnect')
    sio.emit('my response', {'data': 'Connected', 'count': 0}, namespace='/WSConnect')
    print('connected')


@sio.on('disconnect', namespace='/WSConnect')
def disconnect(sid):
    sio.leave_room(sid, "Template", namespace='/WSConnect')
    sio.emit('my response', { 'data': 'Disconected' }, namespace='/WSConnect')


@sio.on('disconnect request', namespace='/WSConnect')
def disconnect_request(sid):
    sio.disconnect(sid, namespace='/WSConnect')


@sio.on('my broadcast event', namespace='/WSConnect')
def test_broadcast_message(sid, message):
    sio.emit('my response', {'data': message['data']}, namespace='/WSConnect')


@sio.on('my room event', namespace='/WSConnect')
def send_room_message(sid, message):
    sio.emit('my response', {'data': message['data']}, room=message['room'], namespace='/WSConnect')


@sio.on('my event', namespace='/WSConnect')
def test_message(sid, message):
    sio.emit('my response', {'data': message['data']}, room=sid, namespace='/WSConnect')


@sio.on('join', namespace='/WSConnect')
def join(sid, message):
    sio.enter_room(sid, message['room'], namespace='/WSConnect')
    sio.emit('my response', {'data': 'Entered room: ' + message['room']}, room=sid, namespace='/WSConnect')


@sio.on('leave', namespace='/WSConnect')
def leave(sid, message):
    sio.leave_room(sid, message['room'], namespace='/WSConnect')
    sio.emit('my response', {'data': 'Left room: ' + message['room']}, room=sid, namespace='/WSConnect')


@sio.on('close room', namespace='/WSConnect')
def close(sid, message):
    sio.emit('my response', {'data': 'Room ' + message['room'] + ' is closing.'}, room=message['room'], namespace='/WSConnect')
    sio.close_room(message['room'], namespace='/WSConnect')


if __name__ == '__main__':
    if sio.async_mode == 'threading':
        app.run(threaded=True)
    elif sio.async_mode == 'eventlet':
        import eventlet
        import eventlet.wsgi
        eventlet.wsgi.server(eventlet.listen(('0.0.0.0', 9902)), app)
    elif sio.async_mode == 'gevent':
        from gevent import pywsgi
        try:
            from geventwebsocket.handler import WebSocketHandler
            websocket = True
        except ImportError:
            websocket = False
        if websocket:
            pywsgi.WSGIServer(('0.0.0.0', 9902), app, handler_class=WebSocketHandler).serve_forever()
        else:
            pywsgi.WSGIServer(('0.0.0.0', 9902), app).serve_forever()
    elif sio.async_mode == 'gevent_uwsgi':
        print('Start the application through the uwsgi server. Example:')
        print('uwsgi --http :9902 --gevent 1000 --http-websockets --master --wsgi-file app.py --callable app')
    else:
        print('Unknown async_mode: ' + sio.async_mode)
