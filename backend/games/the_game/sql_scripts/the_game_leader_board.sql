create table the_game_leader_board
(
	player_name text not null
		constraint the_game_leader_board_users_name_fk
			references users,
	wins integer,
	last_played uuid,
	played integer,
	points integer
);

alter table the_game_leader_board owner to admin;

create index the_game_leader_board_player_name_index
	on the_game_leader_board (player_name);

create index the_game_leader_board_points_index
	on the_game_leader_board (points desc);

