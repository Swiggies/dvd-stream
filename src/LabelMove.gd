extends Label

const COOLDOWN : float = 0.01

var l : Label
var current_vector : Vector2
export var speed : float 
export var colours = []
var cd : float = COOLDOWN
var new_vector : Vector2
	
# Called when the node enters the scene tree for the first time.
func _ready():
	l = get_node("/root/Node2D/Label")
	randomize()
	current_vector = Vector2(rand_range(-1,1), rand_range(-1,1)).normalized()
	get_tree().get_root().set_transparent_background(true)
	if OS.has_feature("JavaScript"):
		l.text = str(JavaScript.eval("new URLSearchParams(window.location.search).get('text')"))
		speed = float(JavaScript.eval("new URLSearchParams(window.location.search).get('speed')"))

func bounce(dir : Vector2):
	current_vector = current_vector.bounce(dir)
	cd = COOLDOWN
	var rng = RandomNumberGenerator.new()
	rng.randomize()
	var num = rng.randi_range(0, colours.size()-1)
	l.modulate = colours[num]

# Called every frame. 'delta' is the elapsed time since the previous frame.
func _physics_process(delta):
	l.rect_position = l.rect_position + (current_vector * delta * speed)
	current_vector = current_vector.normalized()
	cd -= delta
	if cd <= 0:
		if l.rect_size.x + l.rect_position.x >= get_viewport_rect().size.x:
			bounce(Vector2.LEFT)
		if l.rect_size.y + l.rect_position.y >= get_viewport_rect().size.y:
			bounce(Vector2.UP)
		if l.rect_position.x <= 0:
			bounce(Vector2.RIGHT)
		if l.rect_position.y <= 0:
			bounce(Vector2.DOWN)
