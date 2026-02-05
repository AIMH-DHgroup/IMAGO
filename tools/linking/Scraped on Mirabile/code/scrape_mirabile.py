#!/usr/bin/env python3
# -*- coding: utf-8 -*-


# import sys
# reload(sys)
# sys.setdefaultencoding('utf-8')
import os
import sys
import random2
import bs4
# from urllib import urlopen as uReq
import urllib3
import requests
from urllib.parse import urlparse
from bs4 import BeautifulSoup as soup
from django.core.management.base import BaseCommand
import asyncio
from proxybroker import Broker



# JSON file paths
AUTHOR_ID = 0
AUTHOR_BASE_URL = 'http://www.mirabileweb.it/author/a/'
WORK_ID = 0
WORK_BASE_URL = 'http://www.mirabileweb.it/title/a/'
FILENAME_AUTHORS = 'mirabile_authors.csv'
FILENAME_WORKS = 'mirabile_works.csv'
MIRABILE_URL = 'http://www.mirabileweb.it'
DEEPTH = 50000


class Scraper():


    def enterFilename(filename):
        # filename = raw_input("Enter " + text + " filename: ")
        
        filenames = filename.split(".")
        filename = filenames[0] + ".csv"

        return filename

    def openFile(filename, headers):
        #filename = "deepScrapedBipartite_1.csv"
        f = open(filename, "w")
        f.write(headers)
        return f


    def closeFile(f):
        f.close()

    def scrape_author(url, f):
        response = requests.get(url)
        page_soup = soup(response.content, "html.parser")
        errors = page_soup.find_all("td", class_="error_signal")
        if not errors:
            scheda_views = page_soup.find_all("td", class_="scheda_view")
            author = scheda_views[1].getText().strip('\n')
            name = scheda_views[1].span.getText()
            try:
                info = scheda_views[1].contents[2]
            except: 
                info = ""
            permalink = page_soup.find_all("span", class_="permalink")
            linkAuthor = permalink[0].getText()
            # link_schedas = page_soup.find_all("a", class_="linkScheda")
            # for i in range(len(link_schedas)):
            #     if not (link_schedas[i].getText() == "CALMA" or
            #     link_schedas[i].getText() == "MEL" or
            #     link_schedas[i].getText() == "MEM" or
            #     link_schedas[i].getText() == "RICABIM" or
            #     link_schedas[i].getText() == "CANTICUM" or
            #     link_schedas[i].getText() == "Read full text at Corpus Corporum") :
            #         linkWork = MIRABILE_URL + link_schedas[i]["href"]
            #         work = link_schedas[i].getText()
            #         f.write(work+ "##" + linkWork +  "##" + author + "##" + linkAuthor +  "##" + name + "##" + info  + "\n")

            f.write(author + "##" + linkAuthor +  "##" + name + "##" + info  + "\n")

            # print(link_schedas)


    def scraping(my_url, old_url, n, f, t):
        n=n+1
        print ("n: " + str(n))
        http = urllib3.PoolManager()


        navigator = []
        uClient = uReq(my_url)
        page_html = uClient.read()
        uClient.close()
        page_soup = soup(page_html, "html.parser")
        authors = page_soup.find_all("span", class_="visible-contributors")
        author = authors[0].a.string.encode("utf-8")
        containers = page_soup.findAll("div",{"class":"item-container"})
        #container = containers[0]
        #title_container = container.div.findAll("div",{"class":"notranslate_title"})
        #i = 0
        for container in containers:
            title_container = container.find_all("div", class_="book-detail-line")
            title = str(title_container[0].p.string.encode("utf-8"))
            title_url = container.find_all("a", class_="notranslate_title")
            url = title_url[0]["href"]
            autori = container.find_all("span", class_="contributor-name")
            autore =  str(autori[0].string.encode("utf-8"))   
            ratings = container.find_all("div", class_="star-rating")
            if ratings:
                rating =  ratings[0]["aria-label"]
                splited_rating = rating.split(" ")
                rating = str(splited_rating[1])
            else:
                rating = "null"
            prezzi = container.find_all("p", class_="price")
            try:
                prezzo =  str(prezzi[0].span.span.string.encode("utf-8"))
            except:
                prezzo = "gratis"
            header_url="https://www.kobo.com"
            #print(header_url+url)
            navigator.append(header_url+url)
            full_url = header_url + url
            f.write(my_url+ "," + full_url + "\n")
            t.write(full_url + ";" + title + ";" + autore + ";" + rating + ";" + prezzo + "\n")
            #i=i+1
        if not navigator:
            return old_url, my_url
        old_url = my_url
        rnd = random.randint(0,len(navigator)-1)
        my_url = navigator[rnd]
        print(my_url)
        return my_url, old_url

    def readCommunities(filename):
        with open(filename) as f:
            link = tuple(f.read().splitlines())
        links = []
        for l in link:
            links.append(l)
        return links


class Command(BaseCommand):
    help = 'Scrape the Mirabile database of authors and works'
    
    # Define command-line options
    def add_arguments(self, parser):
        parser.add_argument('-t', '--aid', dest='author_id', help='start scraping from this author id',
                            default=AUTHOR_ID)
        parser.add_argument('-o', '--wid', dest='work_id', help='start scraping from this work id',
                            default=WORK_ID)
        parser.add_argument('-f', '--faname', dest='author_filename', help='enter authors filename',
                            default=FILENAME_AUTHORS)
        parser.add_argument('-n', '--fwname', dest='work_filename', help='enter works filename',
                            default=FILENAME_WORKS)
        parser.add_argument('-a', '--authors', dest='author_path', help='scrape authors',
                            action='store_true', default=False)
        parser.add_argument('-w', '--works', dest='work_path', help='scrape sources',
                            action='store_true', default=False)



    def handle(self, *args, **options):
        # Get command-line options
        opt_author_id = options.get('author_id')
        opt_work_id = options.get('work_id')
        opt_authors_filename = options.get('author_filename')
        opt_works_filename = options.get('work_filename')
        opt_authors = options.get('author_path')
        opt_works = options.get('work_path')
       
        # If no options are specified, import everything
        if not (opt_authors or opt_works):
            opt_authors = True
            opt_works = True

        errors = []

        # proxies = asyncio.Queue()
        # broker = Broker(proxies)
        # tasks = asyncio.gather(broker.find(types=['HTTP', 'HTTPS'], limit=10),
        #                     Scraper.save(proxies, filename='proxies.txt'))
        # loop = asyncio.get_event_loop()
        # loop.run_until_complete(tasks)
        try:
            if opt_authors:
                print('   Importing authors...   ', end='')
                print()
                filename = Scraper.enterFilename(opt_authors_filename)
                headers_author = "work##linkWork##author##linkAuthor##name##info\n"
                f = Scraper.openFile(filename, headers_author)
                id = int(opt_author_id)
                # o = urlparse(url)
                # paths = o.path.split("/")
                # i = int(paths[3])
                while id<DEEPTH:
                    print('i: ' + str(id))
                    url = AUTHOR_BASE_URL + str(id)
                    Scraper.scrape_author(url, f)
                    id=id+1
                
                    

            
            if opt_works:
                print('   Importing works...   ', end='')
                print()
                # filename = Scraper.enterFilename(opt_authors_filename)
                # headers_work = "work; linkWork ;author; linkAuthor\n"
                # f = Scraper.openFile(filename, headers_work)
                # url = opt_work_url
                # o = urlparse(url)
                # paths = o.path.split("/")
                # i = int(paths[3])
                # while i<DEEPTH:
                #     print('i: ' + str(i))
                #     url = AUTHOR_BASE_URL + str(i)
                #     # scrape(url)
                #     i=i+1
                # Scraper.closeFile(f)


        # Exit gracefully in case of keyboard interrupt
        except KeyboardInterrupt:
            print('\n')
            sys.exit()

    def main(start, iterations, f, t):
        j = 0
        while j<len(start):
            my_url = start[j]
            print ("j: " + str(j))
            i=0
            print(iterations)
            while i<int(iterations):
                old_url = my_url
                my_url, old_url = scraping(my_url, old_url, i, f, t)
                i=i+1
            j=j+1


# filename = enterFilename("scraped info CSV")

# headers_work = "author; linkAutore; work; linkWork\n"
# f, t = openFiles(filenameCSV, filenameAddInfo)

# start = readCommunities(sys.argv[1])

# main(start, sys.argv[2], f, t)

# closeFile(f, t)