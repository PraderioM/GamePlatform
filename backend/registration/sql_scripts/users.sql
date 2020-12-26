create table users
(
	name text not null
		constraint users_pk
			primary key,
	token uuid
);

comment on table users is 'this table contains information relative to user connection such as username password and token';

alter table users owner to admin;

create unique index users_name_uindex
	on users (name);

