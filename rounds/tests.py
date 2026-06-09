import datetime
from django.contrib.auth import get_user_model
from rest_framework.test import APITestCase
from rest_framework import status
from .models import Round

User = get_user_model()


def make_user(username='golfer', password='testpass123'):
    return User.objects.create_user(username=username, email=f'{username}@test.com', password=password)


def make_round(user, score=90, course_rating=72.0, slope_rating=113, **kwargs):
    return Round.objects.create(
        user=user,
        score=score,
        course_name=kwargs.get('course_name', 'Test Course'),
        course_rating=course_rating,
        slope_rating=slope_rating,
        date_played=kwargs.get('date_played', datetime.date.today()),
    )


class ScoreDifferentialTest(APITestCase):
    def setUp(self):
        self.user = make_user()
        self.client.force_authenticate(user=self.user)

    def test_differential_standard_slope(self):
        # (90 - 72.0) * 113 / 113 = 18.0
        round_ = make_round(self.user, score=90, course_rating=72.0, slope_rating=113)
        res = self.client.get(f'/api/rounds/{round_.id}/')
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertAlmostEqual(res.data['score_differential'], 18.0, places=1)

    def test_differential_high_slope(self):
        # (85 - 71.5) * 113 / 130
        round_ = make_round(self.user, score=85, course_rating=71.5, slope_rating=130)
        res = self.client.get(f'/api/rounds/{round_.id}/')
        expected = round((85 - 71.5) * 113 / 130, 1)
        self.assertAlmostEqual(res.data['score_differential'], expected, places=1)

    def test_differential_under_par(self):
        # (70 - 72.0) * 113 / 113 = -2.0
        round_ = make_round(self.user, score=70, course_rating=72.0, slope_rating=113)
        res = self.client.get(f'/api/rounds/{round_.id}/')
        self.assertAlmostEqual(res.data['score_differential'], -2.0, places=1)


class RoundCRUDTest(APITestCase):
    def setUp(self):
        self.user = make_user()
        self.other = make_user(username='other')
        self.client.force_authenticate(user=self.user)

    def test_create_round(self):
        payload = {
            'score': 88,
            'course_name': 'Pebble Beach',
            'course_rating': '73.2',
            'slope_rating': 145,
            'date_played': '2026-06-01',
        }
        res = self.client.post('/api/rounds/', payload)
        self.assertEqual(res.status_code, status.HTTP_201_CREATED)
        self.assertEqual(res.data['course_name'], 'Pebble Beach')
        self.assertIn('score_differential', res.data)

    def test_list_only_own_rounds(self):
        make_round(self.user)
        make_round(self.other)
        res = self.client.get('/api/rounds/')
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertEqual(len(res.data), 1)

    def test_delete_own_round(self):
        round_ = make_round(self.user)
        res = self.client.delete(f'/api/rounds/{round_.id}/')
        self.assertEqual(res.status_code, status.HTTP_204_NO_CONTENT)

    def test_cannot_delete_other_round(self):
        round_ = make_round(self.other)
        res = self.client.delete(f'/api/rounds/{round_.id}/')
        self.assertEqual(res.status_code, status.HTTP_404_NOT_FOUND)

    def test_requires_authentication(self):
        self.client.force_authenticate(user=None)
        res = self.client.get('/api/rounds/')
        self.assertEqual(res.status_code, status.HTTP_401_UNAUTHORIZED)
