from weight_queue import QueueWithWeight

class Node:
    def __init__(self, name, weight=None):
        self.name = name
        self.weight = weight
        self.color = "white"
        self.children = {}
        self.paths = []


class Graph:
    def __init__(self, file_name=None):
        self.nodes = {}
        self.que = QueueWithWeight()
        if file_name:
            self.create_graph(file_name)

    def create_graph(self, file_name):
        self.nodes = {}
        data = open(file_name, "r")

        for line in data:
            self.nodes = self.process_string(line, self.nodes)
        data.close()
        return self.nodes

    def process_string(self, string, nodes_dict):
        ar = string.strip().split(" ")
        parent = ar[0]
        child = ar[1]
        weight = ar[2]

        if parent in nodes_dict.keys():
            parent = nodes_dict[parent] # Put Node object with name "parent" in parent
            if child in nodes_dict.keys():
                child = nodes_dict[child]
                parent.children[child] = weight
            else:
                nodes_dict[child] = Node(child) # added new Node object to dictionary 
                child = nodes_dict[child]
                parent.children[child] = weight
        else:
            nodes_dict[parent] = Node(parent)
            parent = nodes_dict[parent] # Put Node object with name "parent" in parent
            if child in nodes_dict.keys():
                child = nodes_dict[child]
                parent.children[child] = weight
            else:
                nodes_dict[child] = Node(child) # added new Node object to dictionary 
                child = nodes_dict[child]
                parent.children[child] = weight
        return nodes_dict

    def print_graph(self):
        # print self.nodes
        for i in self.nodes.values():
            print i.name
            tmp = ""
            # if len(i.paths):
                # print i.paths
            if i.children:
                for j in i.children.keys():
                    if j:
                        # j = j[0]
                        # tmp += j.name
                        print "children----" + j.name + str(i.children[j])
            tmp = ""
        print "==========="
        
    def relaxation(self, pre, nex):
        # self.que.add()
        old_weight = nex.weight
        if nex.weight > (pre.weight + pre.children[nex]):
            nex.weight = pre.weight + pre.children[nex]
            self.que.change(nex, old_weight)
    
    def wide_search(self, start, end):
        if start not in self.nodes.keys() and end not in self.nodes.keys():
            print "start or end does not exist in self.nodes"
            quit(1)
        start = self.nodes[start]
        end = self.nodes[end]
        start.paths = [start.name]
        start.color = "grey"
        start.weight = 0
        queue = [start]
        found = False
        while not found:
            new_queue = []
            for i in queue:
                for j in i.children.keys():
                    if j.color == "white":
                        if j == end:
                            # print i.paths, "hhhhhhhhhhh"
                            print "Path: ", i.paths[0] + j.name
                            found = True
                        for k in i.paths:
                            j.paths.append(k + j.name)
                        new_queue.append(j)
                        j.color = "grey"
            queue = new_queue  

node = Node("a", 1)
node2 = Node("b", 2)
# print node.weight
# que = QueueWithweight(node, node2)
# print que.queue_dict
graph = Graph("graph_dei.txt")
graph.print_graph()
graph.wide_search("a","i")