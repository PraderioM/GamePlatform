create table catan_leader_board
(
	player_name text not null
		constraint catan_leader_board_users_name_fk
			references users,
	wins integer default 0 not null,
	last_played uuid,
	played integer default 0 not null,
	points integer default 0 not null
);

alter table catan_leader_board owner to admin;

create index catan_leader_board_player_name_index
	on catan_leader_board (player_name);

create index catan_leader_board_points_index
	on catan_leader_board (points desc);

