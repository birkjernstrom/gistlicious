from redis import StrictRedis
from local import REDIS_PASSWORD

REDIS_HOST = 'scat.redistogo.com'
REDIS_PORT = 9176


class GistStorage(StrictRedis):
    SUPER_KEY = 'testar'

    def save_winner(self, gist_id):
        return client.zincrby(self.SUPER_KEY, gist_id, 1)

    def save_loser(self, gist_id):
        return client.zincrby(self.SUPER_KEY, gist_id, 0)

    def get_rank(self, gist_id):
        return client.zrevrank(self.SUPER_KEY, gist_id)

    def get_points(self, gist_id):
        return client.zscore(self.SUPER_KEY, gist_id)

    def get_rank_list(self, offset=0, num=-1):
        return client.zrevrange(self.SUPER_KEY, offset, num, withscores=True, score_cast_func=float)


# client = GistStorage(host=REDIS_HOST, port=REDIS_PORT, password=REDIS_PASSWORD)
# client.save_winner(12346)
# client.save_loser(12347)
