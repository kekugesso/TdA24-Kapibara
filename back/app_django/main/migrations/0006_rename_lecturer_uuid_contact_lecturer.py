# Generated by Django 5.0.4 on 2024-04-06 13:53

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('main', '0005_alter_contact_lecturer_uuid'),
    ]

    operations = [
        migrations.RenameField(
            model_name='contact',
            old_name='lecturer_uuid',
            new_name='lecturer',
        ),
    ]
