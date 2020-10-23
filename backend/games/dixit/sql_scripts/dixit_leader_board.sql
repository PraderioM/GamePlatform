create table dixit_leader_board
(
	player_name text
		constraint dixit_leader_board_users_name_fk
			references users,
	wins integer,
	last_played uuid,
	played integer,
	points integer
);

alter table dixit_leader_board owner to admin;

create index dixit_leader_board_player_name_index
	on dixit_leader_board (player_name);

create index dixit_leader_board_points_index
	on dixit_leader_board (points desc);

