# Generated by Django 5.0.4 on 2024-04-06 08:30

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Lecturer',
            fields=[
                ('uuid', models.TextField(max_length=255, primary_key=True, serialize=False)),
                ('username', models.TextField()),
                ('password', models.TextField()),
                ('title_before', models.TextField()),
                ('first_name', models.TextField()),
                ('middle_name', models.TextField()),
                ('last_name', models.TextField()),
                ('title_after', models.TextField()),
                ('picture_url', models.TextField()),
                ('location', models.TextField()),
                ('claim', models.TextField()),
                ('bio', models.TextField()),
                ('price_per_hour', models.IntegerField()),
            ],
        ),
        migrations.CreateModel(
            name='Tag',
            fields=[
                ('uuid', models.TextField(primary_key=True, serialize=False)),
                ('name', models.TextField()),
            ],
        ),
        migrations.CreateModel(
            name='Reservation',
            fields=[
                ('id', models.IntegerField(primary_key=True, serialize=False)),
                ('start_time', models.DateTimeField()),
                ('end_time', models.DateTimeField()),
                ('first_name_student', models.TextField()),
                ('last_name_student', models.TextField()),
                ('email_student', models.TextField()),
                ('number_student', models.TextField()),
                ('location', models.TextField()),
                ('notes', models.TextField()),
                ('subject', models.TextField()),
                ('lecture_uuid', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='main.lecturer')),
            ],
        ),
        migrations.CreateModel(
            name='LectureTag',
            fields=[
                ('id', models.IntegerField(primary_key=True, serialize=False)),
                ('lecturer_uuid', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='main.lecturer')),
                ('tag_uuid', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='main.tag')),
            ],
        ),
        migrations.AddField(
            model_name='lecturer',
            name='tags',
            field=models.ManyToManyField(through='main.LectureTag', to='main.tag'),
        ),
    ]