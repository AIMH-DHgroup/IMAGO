"""

| **Project**: HDN
| **Package**: Backend
| **Title**: Models in Django
| **File**: models.py
| **Path**: annotation/
| **Type**: python
| **Started**: 2020-04-26
| **Author(s)**: Nicolo' Pratelli & Daniele Metilli
| **State**: in use

Version history.

:2020-04-26 Nicolo' Pratelli & Daniele Metilli:
    * First version

:2020-05-07 Daniele Metilli:
    * Added Author, Source and Area Models

:2020-06-16 Nicolo' Pratelli:
    * Added Commentary model

:2020-09-14 Nicolo' Pratelli:
    * Changed import command of JsonField 

This file is part of software developed by the Digital Libraries group
of AIMH Laboratory, Institute of Information Science and Technologies
(ISTI-CNR), Pisa, Italy, for the IMAGO and HDN projects.
Further information at: https://hdn.dantenetwork.it
Copyright (C) 2020 ISTI-CNR, Nicolo' Pratelli & Daniele Metilli

This is free software; you can redistribute it and/or modify
it under the terms of the GNU General Public License as published
by the Free Software Foundation; either version 3.0 of the License,
or (at your option) any later version.
This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty
of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.
See the GNU General Public License for more details.
You should have received a copy of the GNU General Public License
along with this program; if not, see <http://www.gnu.org/licenses/>.
"""

from django.contrib.postgres.fields import JSONField
# from django.db.models import JSONField
from django.db import models


class Lemma(models.Model):
    """This class is the model of a Lemma record.
    """
    # id = models.BigIntegerField(unique=True, primary_key=True)
    data = JSONField()

    # Fix plural name in admin
    class Meta:
        ordering = ['id']

class Author(models.Model):
    """This class is the model of a Author record.
    """
    data = JSONField()

    # Fix plural name in admin
    class Meta:
        ordering = ['data__name']

class Work(models.Model):
    """This class is the model of a Work record.
    """
    data = JSONField()

    # Fix plural name in admin
    class Meta:
        ordering = ['data__title']

class Place(models.Model):
    """This class is the model of a Place record.
    """
    data = JSONField()
    
    # Fix plural name in admin
    class Meta:
        verbose_name_plural = 'Places'
        ordering = ['data__name']

# class Topography(models.Model):
#     """This class is the model of a Place record.
#     """
#     data = JSONField()
    
#     # Fix plural name in admin
#     class Meta:
#         verbose_name_plural = 'Topographies'
#         ordering = ['data__name']

class Library(models.Model):
    """This class is the model of a Library record.
    """
    data = JSONField()
    
    # Fix plural name in admin
    class Meta:
        verbose_name_plural = 'Libraries'
        ordering = ['data__name']

class Genre(models.Model):
    """This class is the model of a Genre record.
    """
    data = JSONField()
    
    # Fix plural name in admin
    class Meta:
        verbose_name_plural = 'Genres'
        ordering = ['data__name']

class Source(models.Model):
    """This class is the model of a Source record.
    """
    data = JSONField()
    
    # Fix plural name in admin
    class Meta:
        verbose_name_plural = 'Sources'
        ordering = ['data__name']