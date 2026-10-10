---
title: Graph Traversal: BFS vs DFS with Code Examples
description: How to store a graph in code, how breadth-first and depth-first search work, and where they apply: shortest paths, cycle detection, dependencies.
summary: BFS explores a graph layer by layer with a queue and finds shortest paths in unweighted graphs; DFS goes deep with a stack or recursion and suits cycle detection and topological sorting.
---
## The short answer

**BFS (breadth-first search)** visits every neighbor of the start node first, then the neighbors of those neighbors, and so on. It uses a **queue** and guarantees that, in an unweighted graph, each node is reached by a shortest path.

**DFS (depth-first search)** follows one branch to the end, then backtracks. It uses a **stack** (explicit, or the call stack via recursion) and shines when the structure of paths matters: cycles, connected components, dependency order.

Both visit every vertex and edge once, so both run in **O(V + E)**, where V is the number of vertices and E the number of edges.

## How to store a graph

| Representation | Memory | Edge check | When to use |
|---|---|---|---|
| Adjacency list | O(V + E) | O(degree) | Almost always, especially sparse graphs |
| Adjacency matrix | O(V²) | O(1) | Small, dense graphs |
| Edge list | O(E) | O(E) | Edge-based algorithms, database storage |

For most tasks a dictionary mapping each vertex to its neighbors is enough:

```python
graph = {
    "A": ["B", "C"],
    "B": ["D"],
    "C": ["D", "E"],
    "D": ["F"],
    "E": ["F"],
    "F": [],
}
```

## BFS: shortest path in an unweighted graph

```python
from collections import deque

def shortest_path(graph, start, goal):
    queue = deque([start])
    parent = {start: None}
    while queue:
        node = queue.popleft()
        if node == goal:
            path = []
            while node is not None:
                path.append(node)
                node = parent[node]
            return path[::-1]
        for nxt in graph[node]:
            if nxt not in parent:
                parent[nxt] = node
                queue.append(nxt)
    return None
```

Key points:

- Mark a node as visited **when you enqueue it**, not when you dequeue it, or it may enter the queue several times.
- The `parent` dictionary doubles as the visited set and lets you rebuild the path.
- Use `deque`: `list.pop(0)` in Python takes linear time.

Typical uses: routes with the fewest transfers, "friends of friends" in a social network, crawling a site level by level, flood fill on a grid.

## DFS: cycle detection in a directed graph

In a directed graph, "visited or not" is not enough. You need three states: unvisited, **in progress** (on the current path), and done. Reaching an in-progress node means you found a cycle.

```python
def has_cycle(graph):
    WHITE, GRAY, BLACK = 0, 1, 2
    color = {v: WHITE for v in graph}

    def visit(v):
        color[v] = GRAY
        for nxt in graph[v]:
            if color[nxt] == GRAY:
                return True
            if color[nxt] == WHITE and visit(nxt):
                return True
        color[v] = BLACK
        return False

    return any(color[v] == WHITE and visit(v) for v in graph)
```

## DFS: dependency order

Package managers, build systems and database migrations solve the same problem: run steps so that every dependency comes before what depends on it. That is a **topological sort**, and it is built on DFS: add a node to the result after all its descendants are processed, then reverse the list.

```python
def topo_sort(graph):
    seen, order = set(), []
    def visit(v):
        seen.add(v)
        for nxt in graph[v]:
            if nxt not in seen:
                visit(nxt)
        order.append(v)
    for v in graph:
        if v not in seen:
            visit(v)
    return order[::-1]
```

The result is only valid for acyclic graphs, so in practice it is combined with the cycle check above.

## How to choose

- Need the **shortest path by number of steps** — BFS.
- Need **cycles, components, topological order or all paths** — DFS.
- Edges have **weights** — neither fits; use Dijkstra's algorithm or a relative.
- The graph is very deep — recursive DFS can hit the stack limit, so rewrite it with an explicit stack.

## Common mistakes

- Forgetting the visited set, which makes traversal infinite on a cyclic graph.
- Traversing only one component of a disconnected graph. Start from every unvisited vertex.
- Running BFS on a weighted graph and treating the result as shortest.
- Building an adjacency matrix for a large sparse graph and wasting memory.

## FAQ

### Which is faster, BFS or DFS?

Asymptotically they are the same: O(V + E). They differ in visiting order and memory use. BFS keeps a whole layer of nodes in the queue, DFS keeps only the current path.

### Can DFS be written without recursion?

Yes. Replace recursion with an explicit stack: push the start node, then in a loop pop the last one and push its unvisited neighbors. The visiting order may differ slightly from the recursive version, which rarely matters.

### Does BFS work for maze pathfinding?

Yes, as long as every step costs the same. Grid cells are vertices, adjacent open cells are edges, and BFS finds the path with the fewest steps.
