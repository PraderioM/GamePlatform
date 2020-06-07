create table if not exists tic_tac_toe_leader_board
(
	player_name text not null
		constraint tic_tac_toe_leader_board_users_name_fk
			references users,
	wins integer default 0 not null,
	last_played uuid not null,
	played integer default 0 not null,
	points integer default 0 not null
);

alter table tic_tac_toe_leader_board owner to admin;

create index if not exists tic_tac_toe_leader_board_user_index
	on tic_tac_toe_leader_board (player_name);

create index if not exists tic_tac_toe_leader_board_points_index
	on tic_tac_toe_leader_board (points desc);

