# Generated by Django 5.0.4 on 2024-04-09 08:48

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('main', '0013_alter_reservation_id'),
    ]

    operations = [
        migrations.CreateModel(
            name='Subject',
            fields=[
                ('uuid', models.TextField(primary_key=True, serialize=False)),
                ('name', models.TextField()),
            ],
        ),
        migrations.RenameField(
            model_name='reservation',
            old_name='notes',
            new_name='descrition',
        ),
        migrations.RenameField(
            model_name='reservation',
            old_name='email_student',
            new_name='status',
        ),
        migrations.RemoveField(
            model_name='reservation',
            name='first_name_student',
        ),
        migrations.RemoveField(
            model_name='reservation',
            name='id',
        ),
        migrations.RemoveField(
            model_name='reservation',
            name='last_name_student',
        ),
        migrations.RemoveField(
            model_name='reservation',
            name='number_student',
        ),
        migrations.AddField(
            model_name='reservation',
            name='uuid',
            field=models.TextField(default=1, primary_key=True, serialize=False),
            preserve_default=False,
        ),
        migrations.RemoveField(
            model_name='reservation',
            name='subject',
        ),
        migrations.CreateModel(
            name='Student',
            fields=[
                ('id', models.AutoField(primary_key=True, serialize=False)),
                ('first_name', models.TextField()),
                ('last_name', models.TextField()),
                ('email', models.TextField()),
                ('phone', models.TextField()),
                ('reservation', models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, to='main.reservation')),
            ],
        ),
        migrations.CreateModel(
            name='SubjectReservation',
            fields=[
                ('id', models.AutoField(primary_key=True, serialize=False)),
                ('reservation', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='main.reservation')),
                ('subject', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='main.subject')),
            ],
        ),
        migrations.AddField(
            model_name='reservation',
            name='subject',
            field=models.ManyToManyField(through='main.SubjectReservation', to='main.subject'),
        ),
    ]
