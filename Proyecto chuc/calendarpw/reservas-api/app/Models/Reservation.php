<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;

class Reservation extends Model {
    protected $fillable = ['space_id', 'user_id', 'start_time', 'end_time', 'title'];

    public function space() { return $this->belongsTo(Space::class); }
    public function user() { return $this->belongsTo(User::class); }
}